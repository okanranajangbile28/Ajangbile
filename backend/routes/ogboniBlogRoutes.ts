import express from 'express';

import {
  createOgboniBlog,
  getOgboniBlogs,
  getOgboniBlog,
  getOgboniBlogById,
  updateOgboniBlog,
  deleteOgboniBlog,
  featuredOgboniBlogs,
  searchOgboniBlogs,
} from '../controllers/ogboniBlogController';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// All published Ogboni blogs
router.get('/', getOgboniBlogs);

// Featured Ogboni blogs
router.get('/featured', featuredOgboniBlogs);

// Search Ogboni blogs
router.get('/search', searchOgboniBlogs);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get one Ogboni blog by MongoDB ID
// IMPORTANT: Must come before /:slug
router.get('/admin/:id', getOgboniBlogById);

// Create Ogboni blog
router.post('/', uploadPhoto(), cloudUpload('ogboni-blog'), createOgboniBlog);

// Update Ogboni blog
router.patch(
  '/:id',
  uploadPhoto(),
  cloudUpload('ogboni-blog'),
  updateOgboniBlog,
);

// Delete Ogboni blog
router.delete('/:id', deleteOgboniBlog);

// =====================================================
// PUBLIC BLOG DETAILS
// =====================================================

router.get('/:slug', getOgboniBlog);

export default router;
