import express from 'express';

import {
  initializeConsultationPayment,
  verifyConsultationPayment,
  consultationStripeWebhook,
  bankTransferConsultation,
} from '../controllers/consultationPaymentController';

import { multiplePhotos, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

// ======================================================
// TEST ROUTE
// ======================================================

router.get('/test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Consultation routes are working.',
  });
});

// ======================================================
// STRIPE CONSULTATION PAYMENT
// ======================================================

router.get('/stripe', initializeConsultationPayment);

// ======================================================
// VERIFY STRIPE CONSULTATION PAYMENT
// ======================================================

router.get('/verify', verifyConsultationPayment);

// ======================================================
// BANK TRANSFER CONSULTATION PAYMENT
// ======================================================

router.post(
  '/bank-transfer',
  multiplePhotos([
    {
      name: 'receipt',
      maxCount: 1,
    },
  ]),
  cloudUpload('consultation-receipts'),
  bankTransferConsultation,
);

// ======================================================
// STRIPE CONSULTATION WEBHOOK
// ======================================================

router.post('/stripe/webhook', consultationStripeWebhook);

export default router;
