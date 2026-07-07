import express from 'express';

import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  featuredBlogs,
  searchBlogs,
} from '../controllers/blogV2Controller';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

// Public
router.get('/', getBlogs);
router.get('/featured', featuredBlogs);
router.get('/search', searchBlogs);

// Uses the slug now
router.get('/:slug', getBlog);

// Admin
router.post('/', uploadPhoto(), cloudUpload('blog'), createBlog);

router.patch('/:id', uploadPhoto(), cloudUpload('blog'), updateBlog);

router.delete('/:id', deleteBlog);

export default router;
