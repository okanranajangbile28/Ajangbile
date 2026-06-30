import express from 'express';

import {
  registerMember,
  loginMember,
  getAllMembers,
  approveMember,
} from '../controllers/ogboniController';

const router = express.Router();

router.post('/signup', registerMember);
router.post('/login', loginMember);

router.get('/members', getAllMembers);
router.patch('/approve/:id', approveMember);

export default router;
