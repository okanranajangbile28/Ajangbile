import { Request, Response } from 'express';
import Consultation from '../models/consultationModel';

// ======================================================
// GET ALL CONSULTATIONS
// ======================================================

export const getAllConsultations = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error: unknown) {
    console.error('❌ Error fetching consultation records:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch consultation records.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// GET SINGLE CONSULTATION
// ======================================================

export const getConsultation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id).lean();

    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation record not found.',
      });

      return;
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error: unknown) {
    console.error('❌ Error fetching consultation:', error);

    const message =
      error instanceof Error ? error.message : 'Unable to fetch consultation.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// MARK BANK TRANSFER AS PAID
// ======================================================

export const markConsultationAsPaid = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation record not found.',
      });

      return;
    }

    // ==================================================
    // ONLY BANK TRANSFERS REQUIRE MANUAL CONFIRMATION
    // ==================================================

    if (consultation.paymentMethod !== 'bank_transfer') {
      res.status(400).json({
        success: false,
        message:
          'Only bank transfer consultations require manual payment confirmation.',
      });

      return;
    }

    // ==================================================
    // ALREADY PAID
    // ==================================================

    if (
      consultation.paymentStatus === 'paid' ||
      consultation.bankTransferStatus === 'verified'
    ) {
      res.status(400).json({
        success: false,
        message: 'This consultation has already been marked as paid.',
      });

      return;
    }

    // ==================================================
    // ALREADY REJECTED
    // ==================================================

    if (consultation.bankTransferStatus === 'rejected') {
      res.status(400).json({
        success: false,
        message:
          'This bank transfer has already been rejected and cannot be verified.',
      });

      return;
    }

    // ==================================================
    // CONFIRM PAYMENT
    // ==================================================

    consultation.paymentStatus = 'paid';
    consultation.bankTransferStatus = 'verified';

    // Record the verification/transfer confirmation date
    // only if one does not already exist.
    consultation.bankTransferDate = consultation.bankTransferDate || new Date();

    await consultation.save();

    // ==================================================
    // ADMIN LOG
    // ==================================================

    console.log('======================================');
    console.log('✅ CONSULTATION BANK TRANSFER CONFIRMED');
    console.log(`Consultation ID: ${consultation._id}`);
    console.log(`Consultation: ${consultation.consultationName}`);
    console.log(`Amount: $${consultation.amount.toFixed(2)}`);
    console.log(`Email: ${consultation.email || 'Not provided'}`);
    console.log(`Payment Status: ${consultation.paymentStatus}`);
    console.log(`Bank Status: ${consultation.bankTransferStatus}`);
    console.log(
      `Verified Date: ${consultation.bankTransferDate?.toISOString()}`,
    );
    console.log('======================================');

    res.status(200).json({
      success: true,
      message: 'Consultation payment marked as paid.',
      consultation,
    });
  } catch (error: unknown) {
    console.error('❌ Error confirming consultation payment:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to confirm consultation payment.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// REJECT BANK TRANSFER
// ======================================================

export const rejectConsultationPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation record not found.',
      });

      return;
    }

    // ==================================================
    // ONLY BANK TRANSFERS CAN BE REJECTED MANUALLY
    // ==================================================

    if (consultation.paymentMethod !== 'bank_transfer') {
      res.status(400).json({
        success: false,
        message: 'Only bank transfer consultations can be manually rejected.',
      });

      return;
    }

    // ==================================================
    // ALREADY PAID
    // ==================================================

    if (
      consultation.paymentStatus === 'paid' ||
      consultation.bankTransferStatus === 'verified'
    ) {
      res.status(400).json({
        success: false,
        message: 'This consultation has already been marked as paid.',
      });

      return;
    }

    // ==================================================
    // ALREADY REJECTED
    // ==================================================

    if (consultation.bankTransferStatus === 'rejected') {
      res.status(400).json({
        success: false,
        message: 'This bank transfer has already been rejected.',
      });

      return;
    }

    // ==================================================
    // REJECT PAYMENT
    // ==================================================

    consultation.paymentStatus = 'failed';
    consultation.bankTransferStatus = 'rejected';

    await consultation.save();

    // ==================================================
    // ADMIN LOG
    // ==================================================

    console.log('======================================');
    console.log('❌ CONSULTATION BANK TRANSFER REJECTED');
    console.log(`Consultation ID: ${consultation._id}`);
    console.log(`Consultation: ${consultation.consultationName}`);
    console.log(`Amount: $${consultation.amount.toFixed(2)}`);
    console.log(`Email: ${consultation.email || 'Not provided'}`);
    console.log(`Payment Status: ${consultation.paymentStatus}`);
    console.log(`Bank Status: ${consultation.bankTransferStatus}`);
    console.log('======================================');

    res.status(200).json({
      success: true,
      message: 'Consultation payment rejected.',
      consultation,
    });
  } catch (error: unknown) {
    console.error('❌ Error rejecting consultation payment:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to reject consultation payment.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};
