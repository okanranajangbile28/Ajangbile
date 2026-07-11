import express from 'express';

import {
  getMe,
  getUser,
  updateMe,
  deleteMe,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

import {
  signup,
  login,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} from '../controllers/authControllers';

import {
  signupRequest,
  getSignupRequests,
  approveSignupRequest,
  rejectSignupRequest,
} from '../controllers/memberSignupController';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Normal user signup
router.post('/signup', uploadPhoto(), cloudUpload('users'), signup);

// Pending signup request
router.post('/signup-request', signupRequest);

// Normal login
router.post('/login', login);

// Admin login
router.post('/admin-login', adminLogin);

// Logout
router.get('/logout', logout);

// Forgot password
router.post('/forgotPassword', forgotPassword);

// Reset password
router.patch('/resetPassword/:token', resetPassword);

/*
|--------------------------------------------------------------------------
| Protected User Routes
|--------------------------------------------------------------------------
*/

router.use(protect);

router.get('/me', getMe, getUser);

router.patch('/updateMyPassword', updatePassword);

router.patch('/updateMe', uploadPhoto(), cloudUpload('users'), updateMe);

router.delete('/deleteMe', deleteMe);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Only admin and developer accounts can continue
router.use(restrictTo('admin'));

// Pending signup requests

router.get('/signup-requests', getSignupRequests);

router.patch('/signup-requests/:id/approve', approveSignupRequest);

router.patch('/signup-requests/:id/reject', rejectSignupRequest);

// User management

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
