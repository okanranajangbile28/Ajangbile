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

// ==========================================
// ADMIN
// ==========================================

// All Applications
router.get('/', getApplications);

// Pending Applications
router.get('/pending', getPendingApplications);

// Approved Applicants
router.get('/approved', getApprovedApplications);

// Rejected Applicants
router.get('/rejected', getRejectedApplications);

// Single Application
router.get('/:id', getApplication);

// Approve Application
router.patch('/approve/:id', approveApplication);

// Reject Application
router.patch('/reject/:id', rejectApplication);

// Edit Application
router.patch('/:id', updateApplication);

// Delete Application
router.delete('/:id', deleteApplication);

export default router;
