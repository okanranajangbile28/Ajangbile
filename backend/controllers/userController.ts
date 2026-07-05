import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory';

const filterObj = (obj: { [x: string]: any }, ...allowedFields: string[]) => {
  const newObj: { [key: string]: any } = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

export const getMe = catchAsync<'auth'>(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

export const updateMe = catchAsync<'auth'>(async (req, res, next) => {
  // Password updates are not allowed here
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // Allow users to update these fields
  const filteredBody = filterObj(
    req.body,
    'firstname',
    'lastname',
    'username',
    'email',
    'photo',
  );

  // If Cloudinary uploaded a new profile picture,
  // save its URL.
  if (req.body.images?.length) {
    filteredBody.photo = req.body.images[0];
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync<'auth'>(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = catchAsync(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
});

export const getUser = getOne(User);

export const getAllUsers = getAll(User);

// Do NOT update passwords with this route
export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);
