import express from 'express';

import { signupRequest } from '../controllers/memberSignupController';
import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';
import { sendMembershipApprovalSMS } from '../utils/sendSMS';

const router = express.Router();

console.log('memberSignupRoutes loaded');

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
// TEST TWILIO SMS
// ======================================================

router.get('/test-sms', async (req, res) => {
  try {
    await sendMembershipApprovalSMS({
      phone: '+2348032697087', // replace with your verified number
      fullName: 'Test User',
      initiationDate: new Date(),
      initiationTime: '10:00 AM',
      initiationVenue: 'Iledi Ajangbile',
      initiationFee: 50000,
    });

    res.json({
      success: true,
      message: 'SMS sent successfully.',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to send SMS.',
    });
  }
});

export default router;
