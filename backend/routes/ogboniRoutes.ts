import express from 'express';

import {
  registerMember,
  loginMember,
  getAllMembers,
  approveMember,
  forgotPassword,
  resetPassword,
  updateMemberProfile,
} from '../controllers/ogboniController';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

// ================= Authentication =================

router.post(
  '/signup',
  uploadPhoto(),
  cloudUpload('ogboni-members'),
  registerMember,
);

router.post('/login', loginMember);

// ================= Member Profile =================

router.patch(
  '/update-profile/:id',
  uploadPhoto(),
  cloudUpload('ogboni-members'),
  updateMemberProfile,
);

// ================= Password Reset =================

router.post('/forgot-password', forgotPassword);

router.patch('/reset-password/:token', resetPassword);

// ================= Admin =================

router.get('/members', getAllMembers);

router.patch('/approve/:id', approveMember);

export default router;
