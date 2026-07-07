import express from 'express';

import {
  createBlog,
  getBlogs,
  getBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  featuredBlogs,
  searchBlogs,
} from '../controllers/blogV2Controller';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

// ================= PUBLIC ROUTES =================

// All published blogs
router.get('/', getBlogs);

// Featured blogs
router.get('/featured', featuredBlogs);

// Search blogs
router.get('/search', searchBlogs);

// ================= ADMIN ROUTES =================

// Get one blog by Mongo ID (used for editing in CMS)
// IMPORTANT: This MUST come before '/:slug'
router.get('/admin/:id', getBlogById);

// Create
router.post('/', uploadPhoto(), cloudUpload('blog'), createBlog);

// Update
router.patch('/:id', uploadPhoto(), cloudUpload('blog'), updateBlog);

// Delete
router.delete('/:id', deleteBlog);

// ================= PUBLIC BLOG DETAILS =================

// Get one blog by slug
router.get('/:slug', getBlog);

export default router;
