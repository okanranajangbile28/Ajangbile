import express from 'express';

import {
  registerMember,
  loginMember,
  getAllMembers,
  approveMember,
  forgotPassword,
  resetPassword,
} from '../controllers/ogboniController';

const router = express.Router();

// Authentication
router.post('/signup', registerMember);
router.post('/login', loginMember);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Admin
router.get('/members', getAllMembers);
router.patch('/approve/:id', approveMember);

export default router;
