import express from 'express';

import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  approveApplication,
  rejectApplication,
  getPendingApplications,
  getApprovedApplications,
  getRejectedApplications,
  getPaidApplications,
  markAsPaid,
  scheduleAndSendInitiation,
  resendInitiationEmail,
  resendApprovalEmail,
  submitApplicationFeeBankTransfer,
  verifyBankTransfer,
} from '../controllers/membershipApplicationController';

import { multiplePhotos } from '../controllers/imageHandler';

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

// Submit Membership Application
router.post(
  '/',
  multiplePhotos([
    {
      name: 'passportPhoto',
      maxCount: 1,
    },
    {
      name: 'signature',
      maxCount: 1,
    },
  ]),
  createApplication,
);

// Submit Application Fee by Bank Transfer
router.post(
  '/application-fee/bank-transfer',
  multiplePhotos([
    {
      name: 'applicationFeeReceipt',
      maxCount: 1,
    },
  ]),
  submitApplicationFeeBankTransfer,
);

// ==========================================
// ADMIN
// ==========================================

// All Applications
router.get('/', getApplications);

// Pending Applications
router.get('/pending', getPendingApplications);

// Approved Applicants
router.get('/approved', getApprovedApplications);

// Paid Applicants
router.get('/paid', getPaidApplications);

// Rejected Applicants
router.get('/rejected', getRejectedApplications);

// Verify Application Fee Bank Transfer
router.patch('/verify-application-fee-transfer/:id', verifyBankTransfer);

// Single Application
router.get('/:id', getApplication);

// Approve Application
router.patch('/approve/:id', approveApplication);

// Resend Approval Email
router.post('/resend-approval-email/:id', resendApprovalEmail);

// Mark Applicant as Paid
router.patch('/mark-paid/:id', markAsPaid);

// Reject Application
router.patch('/reject/:id', rejectApplication);

// Edit Application
router.patch('/:id', updateApplication);

// Delete Application
router.delete('/:id', deleteApplication);

// Schedule initiation and send email
router.post('/schedule-initiation/:id', scheduleAndSendInitiation);

// Resend initiation email
router.post('/resend-initiation-email/:id', resendInitiationEmail);

export default router;
