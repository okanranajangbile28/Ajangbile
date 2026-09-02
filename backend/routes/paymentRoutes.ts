import express from 'express';

import {
  initializeApplicationFeePayment,
  initializeInitiationPayment,
  getInitiationBankTransferDetails,
  uploadInitiationBankTransferReceipt,
  submitInitiationBankTransfer,
  verifyPayment,
  stripeInitiationWebhook,
} from '../controllers/paymentController';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

// ======================================================
// MEMBERSHIP APPLICATION FEE
// ======================================================

router.get('/application-fee', initializeApplicationFeePayment);

// ======================================================
// MEMBERSHIP INITIATION PAYMENT - STRIPE
// ======================================================

// Start Stripe Checkout for initiation package
router.get('/initiate', initializeInitiationPayment);

// ======================================================
// MEMBERSHIP INITIATION PAYMENT - BANK TRANSFER
// ======================================================

// Get bank details and package amount
router.get('/initiation-bank-transfer', getInitiationBankTransferDetails);

// ======================================================
// UPLOAD INITIATION BANK TRANSFER RECEIPT
// ======================================================

router.post(
  '/initiation-bank-transfer/receipt',
  uploadPhoto(),
  cloudUpload('membership/payment-receipts'),
  uploadInitiationBankTransferReceipt,
);

// ======================================================
// SUBMIT INITIATION BANK TRANSFER
// ======================================================

router.post('/initiation-bank-transfer', submitInitiationBankTransfer);

// ======================================================
// PAYMENT VERIFICATION
// ======================================================

router.get('/verify', verifyPayment);

// ======================================================
// STRIPE MEMBERSHIP WEBHOOK
// ======================================================
//
// IMPORTANT:
// app.ts applies express.raw() BEFORE this router.
//
// Therefore req.body remains the raw Buffer needed
// by Stripe signature verification.
//

router.post('/stripe/webhook', stripeInitiationWebhook);

export default router;
