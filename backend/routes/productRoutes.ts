import { cloudUpload } from '../controllers/imageHandler';
import express from 'express';
import {
  getAllProducts,
  getProduct,
  updateProduct,
  uploadProduct,
  deleteProduct,
} from '../controllers/productsController';
import { restrictTo, protect } from '../controllers/authControllers';

import {
  multipleSinglePhotos,
  processMultipleImages,
} from '../controllers/imageHandler';

const router = express.Router();

router.route('/').get(getAllProducts);
router.route('/:id').get(getProduct);

// router.use(protect);

// router.use(restrictTo('admin'));

router
  .route('/')
  .post(
    multipleSinglePhotos({ name: 'images', maxCount: 4 }),
    cloudUpload('OA/Product'),
    uploadProduct,
  );
router
  .route('/:id')
  .delete(deleteProduct)
  .put(
    multipleSinglePhotos({ name: 'images', maxCount: 4 }),
    processMultipleImages,
    updateProduct,
  );

export default router;
