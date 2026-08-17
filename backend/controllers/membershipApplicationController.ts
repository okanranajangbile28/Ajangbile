import { Request, Response } from 'express';
import MembershipApplication from '../models/membershipApplicationModel';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import { sendMembershipApprovalEmail } from '../utils/sendEmail';
import { sendMembershipApprovalSMS } from '../utils/sendSMS';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { sendInitiationEmail } from '../utils/sendInitiationEmail';

// =======================
// CLOUDINARY CONFIG
// =======================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =======================
// CLOUDINARY UPLOAD HELPER
// =======================

const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        transformation: [
          {
            width: 1500,
            height: 1500,
            crop: 'limit',
          },
        ],
        public_id: `OA-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed.'));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });
};

// =======================
// CREATE APPLICATION
// =======================

export const createApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as {
      passportPhoto?: Express.Multer.File[];
      signature?: Express.Multer.File[];
    };

    let photo = '';
    let signature = '';

    if (files?.passportPhoto?.[0]) {
      photo = await uploadToCloudinary(
        files.passportPhoto[0],
        'membership/passports',
      );
    }

    if (files?.signature?.[0]) {
      signature = await uploadToCloudinary(
        files.signature[0],
        'membership/signatures',
      );
    }

    if (!photo) {
      res.status(400).json({
        success: false,
        message: 'Passport photograph is required.',
      });
      return;
    }

    if (!signature) {
      res.status(400).json({
        success: false,
        message: 'Signature is required.',
      });
      return;
    }

    // ==================================================
    // CREATE APPLICATION
    // PAYMENT MUST BE COMPLETED BEFORE APPLICATION
    // BECOMES A NORMAL PENDING APPLICATION
    // ==================================================

    const application = await MembershipApplication.create({
      ...req.body,

      photo,
      signature,

      status: 'Payment Pending',

      applicationFeeStatus: 'Pending',

      applicationFeeAmount: 5,

      applicationFeeReference: '',

      applicationFeeDate: undefined,
    });

    res.status(201).json({
      success: true,
      message:
        'Application created. Payment is required to complete submission.',
      applicationId: application._id,
      application,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application.',
    });
  }
};

// =======================
// GET ALL APPLICATIONS
// =======================

export const getApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications.',
    });
  }
};

// =======================
// GET SINGLE APPLICATION
// =======================

export const getApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });

      return;
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch application.',
    });
  }
};

// =======================
// UPDATE APPLICATION
// =======================

export const updateApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });

      return;
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// APPROVE APPLICATION
// =======================

export const approveApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });

      return;
    }

    // ==========================================
    // APPLICATION FEE MUST BE PAID FIRST
    // ==========================================

    if (application.applicationFeeStatus !== 'Paid') {
      res.status(400).json({
        success: false,
        message:
          'This application cannot be approved because the $5 application fee has not been paid.',
      });

      return;
    }

    // ==========================================
    // APPLICATION MUST BE PENDING
    // ==========================================

    if (application.status !== 'Pending') {
      res.status(400).json({
        success: false,
        message: 'Only applications with a Pending status can be approved.',
      });

      return;
    }

    // ==========================================
    // APPROVE APPLICATION
    // ==========================================

    application.status = 'Accepted';

    // Reset initiation payment information
    application.paymentStatus = 'Pending';
    application.paymentAmount = 0;
    application.paymentReference = '';
    application.paymentDate = undefined;

    // Package will be selected later
    application.initiationPackage = undefined;

    // Clear initiation details
    application.initiationDate = undefined;
    application.initiationTime = '';
    application.initiationVenue = '';
    application.initiationInstructions = '';

    await application.save();

    // ==========================================
    // SEND APPROVAL EMAIL
    // ==========================================

    await sendMembershipApprovalEmail({
      fullName: application.fullName,
      email: application.email,
      applicationId: application.id,
    });

    // ==========================================
    // SEND APPROVAL SMS
    // ==========================================

    try {
      await sendMembershipApprovalSMS({
        phone: application.phone,
        fullName: application.fullName,
        initiationDate: application.initiationDate,
        initiationTime: application.initiationTime,
        initiationVenue: application.initiationVenue,
        initiationFee: application.initiationFee,
      });
    } catch (err) {
      console.error('SMS sending failed:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Application approved successfully.',
      application,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// REJECT APPLICATION
// =======================

export const rejectApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });

      return;
    }

    application.status = 'Rejected';

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application rejected successfully.',
      application,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET PAYMENT-PENDING APPLICATIONS
// =======================

export const getPaymentPendingApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find({
      status: 'Payment Pending',
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET PENDING APPLICATIONS
// =======================

export const getPendingApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find({
      status: 'Pending',
      applicationFeeStatus: 'Paid',
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET APPROVED APPLICANTS
// =======================

export const getApprovedApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find({
      status: 'Accepted',
      applicationFeeStatus: 'Paid',
    }).sort({
      initiationDate: 1,
    });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET REJECTED APPLICANTS
// =======================

export const getRejectedApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find({
      status: 'Rejected',
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// DELETE APPLICATION
// =======================

export const deleteApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findByIdAndDelete(
      req.params.id,
    );

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================================
// MARK MEMBER AS PAID
// =======================================================
// This is for the INITIATION payment stage.
// The $5 application fee must already have been paid.

export const markAsPaid = catchAsync(
  async (req: Request, res: Response, next) => {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      return next(new AppError('Application not found.', 404));
    }

    // The $5 application fee must be paid first
    if (application.applicationFeeStatus !== 'Paid') {
      return next(
        new AppError(
          'The $5 application fee must be paid before this member can be marked as Paid.',
          400,
        ),
      );
    }

    // Application must already be accepted
    if (application.status !== 'Accepted') {
      return next(
        new AppError(
          'Only an accepted application can be marked as Paid.',
          400,
        ),
      );
    }

    application.status = 'Paid';
    application.paymentStatus = 'Paid';
    application.paymentDate = new Date();

    await application.save();

    res.status(200).json({
      status: 'success',
      message: 'Member marked as Paid.',
      application,
    });
  },
);

// ======================================================
// GET PAID MEMBERS
// ======================================================

export const getPaidApplications = catchAsync(
  async (req: Request, res: Response) => {
    const applications = await MembershipApplication.find({
      status: 'Paid',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: applications.length,
      applications,
    });
  },
);

// ======================================================
// SCHEDULE & SEND INITIATION
// ======================================================

export const scheduleAndSendInitiation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });

      return;
    }

    // ==================================================
    // INITIATION PAYMENT MUST BE PAID FIRST
    // ==================================================

    if (application.paymentStatus !== 'Paid') {
      res.status(400).json({
        success: false,
        message:
          'Initiation cannot be scheduled because the initiation payment has not been completed.',
      });

      return;
    }

    // ==================================================
    // APPLICATION MUST BE ACCEPTED
    // ==================================================

    if (application.status !== 'Paid') {
      res.status(400).json({
        success: false,
        message: 'This application is not ready for initiation scheduling.',
      });

      return;
    }

    // ==================================================
    // SAVE INITIATION DETAILS
    // ==================================================

    application.initiationDate = req.body.initiationDate;
    application.initiationTime = req.body.initiationTime;
    application.initiationVenue = req.body.initiationVenue;
    application.initiationInstructions = req.body.initiationInstructions;

    // ==================================================
    // CONVERT 24-HOUR TIME TO 12-HOUR AM/PM
    // ==================================================

    const formattedTime = application.initiationTime
      ? new Date(`1970-01-01T${application.initiationTime}`).toLocaleTimeString(
          'en-US',
          {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          },
        )
      : '';

    // ==================================================
    // SEND INITIATION EMAIL
    // ==================================================

    await sendInitiationEmail({
      fullName: application.fullName,
      email: application.email,
      initiationDate: application.initiationDate,
      initiationTime: formattedTime,
      initiationVenue: application.initiationVenue || '',
      initiationInstructions: application.initiationInstructions || '',
    });

    // ==================================================
    // MARK INITIATION AS SCHEDULED
    // ==================================================

    application.initiationStatus = 'Scheduled';

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Initiation scheduled and email sent successfully.',
      application,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to schedule initiation.',
    });
  }
};

// ======================================================
// RESEND INITIATION EMAIL
// ======================================================

export const resendInitiationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
      return;
    }

    // Convert 24-hour time to 12-hour AM/PM
    const formattedTime = application.initiationTime
      ? new Date(`1970-01-01T${application.initiationTime}`).toLocaleTimeString(
          'en-US',
          {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          },
        )
      : '';

    await sendInitiationEmail({
      fullName: application.fullName,
      email: application.email,
      initiationDate: application.initiationDate,
      initiationTime: formattedTime,
      initiationVenue: application.initiationVenue || '',
      initiationInstructions: application.initiationInstructions || '',
    });

    res.status(200).json({
      success: true,
      message: 'Initiation email resent successfully.',
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
