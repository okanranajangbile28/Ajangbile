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
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} from '../controllers/authControllers';

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.post('/signup', uploadPhoto(), cloudUpload('users'), signup);

router.post('/login', login);

router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

/*
|--------------------------------------------------------------------------
| Protected Routes
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

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
