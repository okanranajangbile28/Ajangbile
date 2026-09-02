import express from 'express';

import { getPricing, updatePricing } from '../controllers/pricingController';

const router = express.Router();

router.get('/', getPricing);

router.put('/', updatePricing);

export default router;
