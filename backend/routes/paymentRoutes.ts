import express from 'express';

import {
  initializeInitiationPayment,
  verifyPayment,
} from '../controllers/paymentController';

const router = express.Router();

router.get('/initiate', initializeInitiationPayment);

router.get('/verify', verifyPayment);

export default router;
