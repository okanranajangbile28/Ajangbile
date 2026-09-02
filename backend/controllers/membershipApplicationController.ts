import { Request, Response } from 'express';
import MembershipApplication from '../models/membershipApplicationModel';
import Pricing from '../models/pricingModel';
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

      applicationFeeAmount: 12,

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

// ======================================================
// SUBMIT APPLICATION FEE BY BANK TRANSFER
// ======================================================

export const submitApplicationFeeBankTransfer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { applicationId } = req.body;

    // ==================================================
    // APPLICATION ID
    // ==================================================

    if (!applicationId) {
      res.status(400).json({
        success: false,
        message: 'Application ID is required.',
      });

      return;
    }

    // ==================================================
    // RECEIPT FILE
    // ==================================================

    const files = req.files as {
      applicationFeeReceipt?: Express.Multer.File[];
    };

    const receiptFile = files?.applicationFeeReceipt?.[0];

    if (!receiptFile) {
      res.status(400).json({
        success: false,
        message: 'Please upload your bank transfer receipt.',
      });

      return;
    }

    // ==================================================
    // FIND APPLICATION
    // ==================================================

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    // ==================================================
    // PREVENT DUPLICATE PAYMENT
    // ==================================================

    if (application.applicationFeeStatus === 'Paid') {
      res.status(400).json({
        success: false,
        message: 'The application fee has already been paid.',
      });

      return;
    }

    // ==================================================
    // GET CURRENT CENTRAL APPLICATION FEE
    // ==================================================

    let pricing = await Pricing.findOne();

    if (!pricing) {
      pricing = await Pricing.create({});
    }

    const currentApplicationFee = pricing.applicationFee;

    // ==================================================
    // UPLOAD RECEIPT
    // ==================================================

    const receipt = await uploadToCloudinary(
      receiptFile,
      'membership/application-fee-receipts',
    );

    // ==================================================
    // SAVE BANK TRANSFER PAYMENT
    // ==================================================

    application.applicationFeePaymentMethod = 'bank_transfer';

    application.applicationFeeBankTransferStatus = 'Pending';

    // No customer-facing transfer reference is required.
    application.applicationFeeBankTransferReference = '';

    application.applicationFeeBankTransferDate = new Date();

    application.applicationFeeBankTransferReceipt = receipt;

    application.applicationFeeBankTransferReceiptPublicId = '';

    application.applicationFeeStatus = 'Pending';

    application.applicationFeeAmount = currentApplicationFee;

    application.status = 'Payment Pending';

    await application.save();

    // ==================================================
    // SUCCESS
    // ==================================================

    res.status(200).json({
      success: true,
      message:
        'Bank transfer receipt submitted successfully. Your payment is awaiting verification.',
      application,
      redirectUrl: '/bank-transfer-success',
    });
  } catch (error: any) {
    console.error('❌ Application fee bank transfer submission error:');
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || 'Unable to submit your bank transfer receipt.',
    });
  }
};

// ======================================================
// VERIFY APPLICATION FEE BY BANK TRANSFER
// ======================================================

export const verifyBankTransfer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    if (application.applicationFeePaymentMethod !== 'bank_transfer') {
      res.status(400).json({
        success: false,
        message: 'This application does not have a bank transfer payment.',
      });

      return;
    }

    if (application.applicationFeeStatus === 'Paid') {
      res.status(400).json({
        success: false,
        message: 'The application fee has already been verified.',
      });

      return;
    }

    if (application.applicationFeeBankTransferStatus !== 'Pending') {
      res.status(400).json({
        success: false,
        message: 'This bank transfer is not awaiting verification.',
      });

      return;
    }

    application.applicationFeeBankTransferStatus = 'Verified';

    application.applicationFeeStatus = 'Paid';

    application.applicationFeeAmount = 12;

    application.applicationFeeDate = new Date();

    application.applicationFeeReference =
      application.applicationFeeBankTransferReference;

    application.status = 'Pending';

    await application.save();

    console.log('======================================');
    console.log('✅ BANK TRANSFER VERIFIED');
    console.log(`Application ID: ${application._id}`);
    console.log(`Name: ${application.fullName}`);
    console.log(
      `Reference: ${application.applicationFeeBankTransferReference}`,
    );
    console.log('Amount: $12.00');
    console.log('======================================');

    res.status(200).json({
      success: true,
      message: 'Bank transfer verified successfully.',
      application,
    });
  } catch (error: any) {
    console.error('❌ Bank transfer verification error:');
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify bank transfer.',
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
          'This application cannot be approved because the $12 application fee has not been paid.',
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

// ======================================================
// RESEND APPROVAL EMAIL
// ======================================================

export const resendApprovalEmail = async (
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

    // Only accepted applicants should receive
    // the membership approval email.
    if (application.status !== 'Accepted') {
      res.status(400).json({
        success: false,
        message: 'Approval email can only be resent to an accepted applicant.',
      });

      return;
    }

    // The application fee must already be paid.
    if (application.applicationFeeStatus !== 'Paid') {
      res.status(400).json({
        success: false,
        message:
          'The approval email cannot be resent because the application fee has not been paid.',
      });

      return;
    }

    await sendMembershipApprovalEmail({
      fullName: application.fullName,
      email: application.email,
      applicationId: application.id,
    });

    res.status(200).json({
      success: true,
      message: 'Approval email resent successfully.',
    });
  } catch (error: any) {
    console.error('❌ Resend approval email error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Unable to resend approval email.',
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
      message: 'Failed to fetch pending applications.',
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
      message: 'Failed to fetch approved applications.',
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
      message: 'Failed to fetch rejected applications.',
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
// The $12 application fee must already have been paid.

export const markAsPaid = catchAsync(
  async (req: Request, res: Response, next) => {
    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      return next(new AppError('Application not found.', 404));
    }

    // The $12 application fee must be paid first
    if (application.applicationFeeStatus !== 'Paid') {
      return next(
        new AppError(
          'The $12 application fee must be paid before this member can be marked as Paid.',
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
