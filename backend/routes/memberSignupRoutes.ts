import express from 'express';

import { signupRequest } from '../controllers/memberSignupController';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

import { sendSMS } from '../utils/sendSMS';

const router = express.Router();

// ======================================================
// Existing member requests an online login account
// ======================================================

router.post(
  '/signup',
  uploadPhoto(),
  cloudUpload('member-signups'),
  signupRequest,
);

// ======================================================
// SMS TEST ROUTE
// ======================================================

router.get('/test-sms', async (req, res) => {
  try {
    await sendSMS({
      to: '+2348032697087',
      message: 'Termii SMS test from Iledi Ajangbile.',
    });

    res.json({
      success: true,
      message: 'SMS sent successfully.',
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
