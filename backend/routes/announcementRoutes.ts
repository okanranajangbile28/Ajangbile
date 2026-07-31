import express from 'express';

import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController';

import {
  uploadAnnouncementImage,
  cloudUpload,
  processMultipleImages,
} from '../controllers/imageHandler';

const router = express.Router();

// =========================
// GET ALL
// =========================

router.get('/', getAnnouncements);

// =========================
// CREATE
// =========================

router.post(
  '/',
  uploadAnnouncementImage(),
  cloudUpload('announcements'),
  processMultipleImages,
  createAnnouncement,
);

// =========================
// UPDATE
// =========================

router.patch(
  '/:id',
  uploadAnnouncementImage(),
  cloudUpload('announcements'),
  processMultipleImages,
  updateAnnouncement,
);

// =========================
// DELETE
// =========================

router.delete('/:id', deleteAnnouncement);

export default router;
