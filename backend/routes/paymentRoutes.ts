import express from 'express';

import {
  initializeApplicationFeePayment,
  initializeInitiationPayment,
  verifyPayment,
  stripeInitiationWebhook,
} from '../controllers/paymentController';

const router = express.Router();

// ======================================================
// MEMBERSHIP APPLICATION FEE
// ======================================================

// Start Stripe Checkout for the $5 application fee
router.get('/application-fee', initializeApplicationFeePayment);

// ======================================================
// MEMBERSHIP INITIATION PAYMENT
// ======================================================

// Start Stripe Checkout for initiation package
router.get('/initiate', initializeInitiationPayment);

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
// Therefore req.body remains the raw Buffer needed
// by Stripe signature verification.
//

router.post('/stripe/webhook', stripeInitiationWebhook);

export default router;
