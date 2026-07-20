import express from 'express';
import * as contactController from '../controllers/contactController';

const router = express.Router();

router.post('/', contactController.sendContactMessage);

export default router;
