import { Request, Response } from 'express';
import MembershipApplication from '../models/membershipApplicationModel';

// ======================================================
// HELPERS
// ======================================================

const isStripeReference = (reference?: string): boolean => {
  if (!reference) {
    return false;
  }

  return reference.startsWith('pi_') || reference.startsWith('cs_');
};

const getPackageAmount = (packageName?: string): number | undefined => {
  switch (packageName) {
    case 'Basic':
      return 224;

    case 'Standard':
      return 450;

    case 'Premium':
      return 750;

    default:
      return undefined;
  }
};

// ======================================================
// NORMALIZE INITIATION PAYMENT
// ======================================================
//
// Some older records were Stripe payments but were
// incorrectly saved with:
//
// paymentMethod: "bank_transfer"
//
// Stripe references allow us to identify those records
// safely without changing genuine bank-transfer payments.
// ======================================================

const normalizeInitiationPayment = (application: any) => {
  const normalized = {
    ...application,
  };

  const stripePayment = isStripeReference(application.paymentReference);

  if (stripePayment) {
    normalized.paymentMethod = 'stripe';

    const correctAmount = getPackageAmount(application.initiationPackage);

    if (correctAmount !== undefined) {
      normalized.paymentAmount = correctAmount;
    }

    // Old Stripe records should not display bank-transfer
    // status information.
    normalized.bankTransferStatus = undefined;
    normalized.bankTransferReference = '';
    normalized.bankTransferReceipt = '';
    normalized.bankTransferReceiptPublicId = '';
  }

  return normalized;
};

// ======================================================
// GET ALL INITIATION PAYMENTS
// ======================================================

export const getAllInitiationPayments = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find({
      initiationPackage: {
        $in: ['Basic', 'Standard', 'Premium'],
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    const normalizedApplications = applications.map(normalizeInitiationPayment);

    res.status(200).json({
      success: true,
      count: normalizedApplications.length,
      applications: normalizedApplications,
    });
  } catch (error: unknown) {
    console.error('❌ Error fetching initiation payments:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch initiation payments.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// GET PENDING INITIATION BANK TRANSFERS
// ======================================================

export const getPendingInitiationPayments = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applications = await MembershipApplication.find({
      initiationPackage: {
        $in: ['Basic', 'Standard', 'Premium'],
      },

      paymentMethod: 'bank_transfer',

      bankTransferStatus: 'Pending',

      paymentStatus: 'Pending',
    })
      .sort({ createdAt: -1 })
      .lean();

    // Exclude old Stripe records that were incorrectly
    // stored as bank_transfer.
    const bankTransferApplications = applications.filter(
      (application) => !isStripeReference(application.paymentReference),
    );

    res.status(200).json({
      success: true,
      count: bankTransferApplications.length,
      applications: bankTransferApplications,
    });
  } catch (error: unknown) {
    console.error('❌ Error fetching pending initiation payments:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch pending initiation payments.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// GET SINGLE INITIATION PAYMENT
// ======================================================

export const getInitiationPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      res.status(400).json({
        success: false,
        message: 'Missing application ID.',
      });

      return;
    }

    const application =
      await MembershipApplication.findById(applicationId).lean();

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    const normalizedApplication = normalizeInitiationPayment(application);

    res.status(200).json({
      success: true,
      application: normalizedApplication,
    });
  } catch (error: unknown) {
    console.error('❌ Error fetching initiation payment:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch initiation payment.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// VERIFY INITIATION BANK TRANSFER
// ======================================================

export const verifyInitiationBankTransfer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      res.status(400).json({
        success: false,
        message: 'Missing application ID.',
      });

      return;
    }

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    // ==================================================
    // PROTECT AGAINST OLD STRIPE RECORDS
    // ==================================================

    if (isStripeReference(application.paymentReference)) {
      res.status(400).json({
        success: false,
        message:
          'This payment is a Stripe payment and cannot be manually verified as a bank transfer.',
      });

      return;
    }

    // ==================================================
    // ONLY BANK TRANSFERS CAN BE MANUALLY VERIFIED
    // ==================================================

    if (application.paymentMethod !== 'bank_transfer') {
      res.status(400).json({
        success: false,
        message:
          'Only bank transfer initiation payments can be manually verified.',
      });

      return;
    }

    // ==================================================
    // ALREADY PAID
    // ==================================================

    if (
      application.paymentStatus === 'Paid' ||
      application.bankTransferStatus === 'Verified'
    ) {
      res.status(400).json({
        success: false,
        message: 'This initiation payment has already been verified.',
      });

      return;
    }

    // ==================================================
    // ALREADY REJECTED
    // ==================================================

    if (application.bankTransferStatus === 'Rejected') {
      res.status(400).json({
        success: false,
        message:
          'This bank transfer has already been rejected and cannot be verified.',
      });

      return;
    }

    // ==================================================
    // VERIFY PAYMENT
    // ==================================================

    application.bankTransferStatus = 'Verified';

    application.paymentStatus = 'Paid';

    application.paymentReference =
      application.bankTransferReference || 'BANK_TRANSFER';

    application.paymentDate = new Date();

    application.status = 'Paid';

    await application.save();

    console.log('======================================');
    console.log('✅ INITIATION BANK TRANSFER VERIFIED');
    console.log(`Application ID: ${application._id}`);
    console.log(`Applicant: ${application.fullName || 'Not provided'}`);
    console.log(`Package: ${application.initiationPackage || 'Not provided'}`);
    console.log(
      `Amount: $${Number(application.paymentAmount || 0).toFixed(2)}`,
    );
    console.log(`Email: ${application.email || 'Not provided'}`);
    console.log(`Payment Status: ${application.paymentStatus}`);
    console.log(`Bank Transfer Status: ${application.bankTransferStatus}`);
    console.log('======================================');

    res.status(200).json({
      success: true,
      message: 'Initiation bank transfer verified successfully.',
      application,
    });
  } catch (error: unknown) {
    console.error('❌ Error verifying initiation bank transfer:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to verify initiation bank transfer.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// REJECT INITIATION BANK TRANSFER
// ======================================================

export const rejectInitiationBankTransfer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      res.status(400).json({
        success: false,
        message: 'Missing application ID.',
      });

      return;
    }

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    // ==================================================
    // PROTECT AGAINST OLD STRIPE RECORDS
    // ==================================================

    if (isStripeReference(application.paymentReference)) {
      res.status(400).json({
        success: false,
        message:
          'This payment is a Stripe payment and cannot be manually rejected as a bank transfer.',
      });

      return;
    }

    // ==================================================
    // ONLY BANK TRANSFERS CAN BE MANUALLY REJECTED
    // ==================================================

    if (application.paymentMethod !== 'bank_transfer') {
      res.status(400).json({
        success: false,
        message:
          'Only bank transfer initiation payments can be manually rejected.',
      });

      return;
    }

    // ==================================================
    // ALREADY PAID
    // ==================================================

    if (
      application.paymentStatus === 'Paid' ||
      application.bankTransferStatus === 'Verified'
    ) {
      res.status(400).json({
        success: false,
        message:
          'This initiation payment has already been verified and cannot be rejected.',
      });

      return;
    }

    // ==================================================
    // ALREADY REJECTED
    // ==================================================

    if (application.bankTransferStatus === 'Rejected') {
      res.status(400).json({
        success: false,
        message: 'This bank transfer has already been rejected.',
      });

      return;
    }

    // ==================================================
    // REJECT PAYMENT
    // ==================================================

    application.bankTransferStatus = 'Rejected';

    application.paymentStatus = 'Pending';

    await application.save();

    console.log('======================================');
    console.log('❌ INITIATION BANK TRANSFER REJECTED');
    console.log(`Application ID: ${application._id}`);
    console.log(`Applicant: ${application.fullName || 'Not provided'}`);
    console.log(`Package: ${application.initiationPackage || 'Not provided'}`);
    console.log(
      `Amount: $${Number(application.paymentAmount || 0).toFixed(2)}`,
    );
    console.log(`Email: ${application.email || 'Not provided'}`);
    console.log(`Payment Status: ${application.paymentStatus}`);
    console.log(`Bank Transfer Status: ${application.bankTransferStatus}`);
    console.log('======================================');

    res.status(200).json({
      success: true,
      message: 'Initiation bank transfer rejected.',
      application,
    });
  } catch (error: unknown) {
    console.error('❌ Error rejecting initiation bank transfer:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to reject initiation bank transfer.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};
