import express from 'express';

import {
  uploadProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController';

import {
  multipleSinglePhotos,
  cloudUpload,
  processMultipleImages,
} from '../controllers/imageHandler';

import { protect, restrictTo } from '../controllers/authControllers';

const router = express.Router();

/* ==========================================================
   PUBLIC ROUTES
========================================================== */

router.get('/', getAllProducts);
router.get('/:id', getProduct);

/* ==========================================================
   ADMIN ROUTES
========================================================== */

// Enable these when your authentication is ready.
// router.use(protect);
// router.use(restrictTo('admin'));

/* ==========================================================
   CREATE PRODUCT
========================================================== */

router.post(
  '/',
  multipleSinglePhotos({
    name: 'images',
    maxCount: 4,
  }),
  cloudUpload('products'),
  processMultipleImages,
  uploadProduct,
);

/* ==========================================================
   UPDATE PRODUCT
========================================================== */

router.put(
  '/:id',
  multipleSinglePhotos({
    name: 'images',
    maxCount: 4,
  }),
  cloudUpload('products'),
  processMultipleImages,
  updateProduct,
);

/* ==========================================================
   DELETE PRODUCT
========================================================== */

router.delete('/:id', deleteProduct);

export default router;
