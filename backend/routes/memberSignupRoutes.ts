import express from 'express';
import { signupRequest } from '../controllers/memberSignupController';

const router = express.Router();

// Existing member requests an online login account
router.post('/signup', signupRequest);

export default router;
