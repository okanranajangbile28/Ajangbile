import express from 'express';
import {
  cloudUpload,
  multipleSinglePhotos,
  processMultipleImages,
} from '../controllers/imageHandler';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
} from '../controllers/blogControllers';
import { protect, restrictTo } from '../controllers/authControllers';

const router = express.Router();

router.route('/').get(getAllBlogs);
router.route('/:id').get(getBlog);
// router.use(protect);

// router.use(restrictTo('admin'));
//create blog
router
  .route('/')
  .post(
    multipleSinglePhotos({ name: 'images', maxCount: 4 }),
    cloudUpload('OA/Blog'),
    createBlog,
  )
  .get(getAllBlogs);
router
  .route('/:id')
  .delete(deleteBlog)
  .patch(
    multipleSinglePhotos({ name: 'images', maxCount: 4 }),
    processMultipleImages,
    updateBlog,
  );

export default router;
