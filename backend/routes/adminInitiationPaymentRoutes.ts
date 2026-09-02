import express from 'express';

import {
  getAllInitiationPayments,
  getPendingInitiationPayments,
  getInitiationPayment,
  verifyInitiationBankTransfer,
  rejectInitiationBankTransfer,
} from '../controllers/adminInitiationPaymentController';

import { protect, restrictTo } from '../controllers/authControllers';

const router = express.Router();

// ======================================================
// ADMIN PROTECTION
// ======================================================

router.use(protect);
router.use(restrictTo('admin', 'developer'));

// ======================================================
// GET ALL INITIATION PAYMENTS
// ======================================================

router.get('/', getAllInitiationPayments);

// ======================================================
// GET PENDING BANK TRANSFERS
// ======================================================

router.get('/pending', getPendingInitiationPayments);

// ======================================================
// GET SINGLE INITIATION PAYMENT
// ======================================================

router.get('/:applicationId', getInitiationPayment);

// ======================================================
// VERIFY BANK TRANSFER
// ======================================================

router.patch('/:applicationId/verify', verifyInitiationBankTransfer);

// ======================================================
// REJECT BANK TRANSFER
// ======================================================

router.patch('/:applicationId/reject', rejectInitiationBankTransfer);

export default router;
