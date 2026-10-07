import express from 'express';

import {
  getIlediOgboniPosts,
  createIlediOgboniPost,
  updateIlediOgboniPost,
  deleteIlediOgboniPost,
  toggleIlediOgboniPostLike,
  addIlediOgboniPostComment,
  deleteIlediOgboniPostComment,
} from '../controllers/ilediOgboniPostController';

import { protect, restrictTo } from '../controllers/authControllers';

import { protectOgboniMember } from '../middleware/ogboniAuth';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN IMAGE UPLOAD
|--------------------------------------------------------------------------
| Uploads one Iledi Ogboni post image to the existing Cloudinary account.
| Only authenticated admin/developer users can upload.
*/

router.post(
  '/image',
  protect,
  restrictTo('admin', 'developer'),
  uploadPhoto(),
  cloudUpload('iledi-ogboni-posts'),
  (req, res) => {
    const images = req.body.images || [];

    res.status(200).json({
      success: true,
      image: images[0] || '',
    });
  },
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
| Normal website admin authentication.
| Only admin/developer users can manage community posts.
*/

// Create post
router.post(
  '/',
  protect,
  restrictTo('admin', 'developer'),
  createIlediOgboniPost,
);

// Edit post
router.patch(
  '/:id',
  protect,
  restrictTo('admin', 'developer'),
  updateIlediOgboniPost,
);

// Delete post
router.delete(
  '/:id',
  protect,
  restrictTo('admin', 'developer'),
  deleteIlediOgboniPost,
);

// Admin: view all community posts
router.get(
  '/admin',
  protect,
  restrictTo('admin', 'developer'),
  getIlediOgboniPosts,
);

/*
|--------------------------------------------------------------------------
| OGBONI MEMBER ROUTES
|--------------------------------------------------------------------------
| Separate authentication using the Ogboni member JWT.
*/

// View private community feed
router.get('/', protectOgboniMember, getIlediOgboniPosts);

// Like / unlike post
router.post('/:id/like', protectOgboniMember, toggleIlediOgboniPostLike);

// Add comment
router.post('/:id/comments', protectOgboniMember, addIlediOgboniPostComment);

// Delete own comment
router.delete(
  '/:id/comments/:commentId',
  protectOgboniMember,
  deleteIlediOgboniPostComment,
);

export default router;
