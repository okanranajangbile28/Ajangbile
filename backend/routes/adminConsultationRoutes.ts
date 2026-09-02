import express from 'express';

import {
  getAllConsultations,
  getConsultation,
  markConsultationAsPaid,
  rejectConsultationPayment,
} from '../controllers/adminConsultationController';

import { protect, restrictTo } from '../controllers/authControllers';

const router = express.Router();

// ======================================================
// ADMIN AUTHENTICATION
// ======================================================
//
// Every route in this file requires:
// 1. A valid authenticated user
// 2. Admin or developer role
//
// ======================================================

router.use(protect);

router.use(restrictTo('admin', 'developer'));

// ======================================================
// GET ALL CONSULTATIONS
// ======================================================
//
// GET
// /api/admin/consultations
//
// Used by:
// frontend/.../admin/Consultations.tsx
//
// ======================================================

router.get('/', getAllConsultations);

// ======================================================
// GET SINGLE CONSULTATION
// ======================================================
//
// GET
// /api/admin/consultations/:id
//
// ======================================================

router.get('/:id', getConsultation);

// ======================================================
// VERIFY / MARK BANK TRANSFER AS PAID
// ======================================================
//
// PATCH
// /api/admin/consultations/:id/paid
//
// This matches the frontend admin action.
//
// ======================================================

router.patch('/:id/paid', markConsultationAsPaid);

// ======================================================
// REJECT BANK TRANSFER
// ======================================================
//
// PATCH
// /api/admin/consultations/:id/reject
//
// This matches the frontend admin action.
//
// ======================================================

router.patch('/:id/reject', rejectConsultationPayment);

export default router;
