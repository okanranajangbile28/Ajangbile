import { Request, Response } from 'express';
import MembershipApplication from '../models/membershipApplicationModel';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import { sendMembershipApprovalEmail } from '../utils/sendEmail';
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

    const application = await MembershipApplication.create({
      ...req.body,
      photo,
      signature,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Membership application submitted successfully.',
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
    const {
      initiationDate,
      initiationTime,
      initiationVenue,
      initiationInstructions,
    } = req.body;

    const application = await MembershipApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
      return;
    }

    application.status = 'Accepted';

    if (initiationDate) {
      application.initiationDate = new Date(initiationDate);
    }

    application.initiationTime = initiationTime || '';

    application.initiationVenue = initiationVenue || '';

    application.initiationInstructions = initiationInstructions || '';

    await application.save();

    // =======================
    // SEND APPROVAL EMAIL
    // =======================

    await sendMembershipApprovalEmail({
      fullName: application.fullName,
      email: application.email,
      initiationDate: application.initiationDate,
      initiationTime: application.initiationTime,
      initiationVenue: application.initiationVenue,
      initiationInstructions: application.initiationInstructions,
    });

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
// GET PENDING APPLICATIONS
// =======================

export const getPendingApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find({
      status: 'Pending',
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
