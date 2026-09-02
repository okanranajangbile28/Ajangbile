import express from 'express';

import { getPricing, updatePricing } from '../controllers/pricingController';

import { protect, restrictTo } from '../controllers/authControllers';

const router = express.Router();

// Public: customers need to read current prices
router.get('/', getPricing);

// Protected: only admin/developer can change prices
router.put('/', protect, restrictTo('admin', 'developer'), updatePricing);

export default router;
