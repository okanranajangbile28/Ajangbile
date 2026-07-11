import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { sendMail } from '../utils/email';
import { IUser } from '../types';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(user.id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  user.password = '';

  res.status(statusCode).json({
    status: 'success',

    token,

    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstname: req.body.firstname,

    lastname: req.body.lastname,

    fullname: `${req.body.firstname} ${req.body.lastname}`,

    username: req.body.username,

    email: req.body.email,

    photo: req.body.images?.[0] || '',

    password: req.body.password,

    passwordConfirm: req.body.passwordConfirm,

    // Nobody can create admin account
    role: 'member',
  });

  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide admin email and password', 400));
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect admin credentials', 401));
  }

  if (user.role !== 'admin' && user.role !== 'developer') {
    return next(new AppError('You do not have admin access', 403));
  }

  createSendToken(user, 200, req, res);
});

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({
    status: 'success',
  });
};

const jwtVerifyPromisified = (
  token: string,
  secret: string,
): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
};

export const protect = catchAsync<'auth'>(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  const decoded = await jwtVerifyPromisified(
    token,
    process.env.JWT_SECRET as string,
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat as number)) {
    return next(new AppError('Password changed. Login again.', 401));
  }

  req.user = currentUser;

  res.locals.user = currentUser;

  next();
});

export const restrictTo = (...roles: Array<'admin' | 'developer' | 'member'>) =>
  catchAsync<'auth'>(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }

    next();
  });

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new AppError('No user with that email', 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  try {
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      from: 'adeyinkaroqeeb@gmail.com',

      to: user.email,

      subject: 'PASSWORD RESET',

      text: 'Reset password',

      html: `
      <p>
      <a href="${resetURL}">
      Reset Password
      </a>
      </p>
      `,
    });

    res.status(200).json({
      status: 'success',

      message: 'Token sent to email',
    });
  } catch {
    user.passwordResetToken = undefined;

    user.passwordResetExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(new AppError('Email failed', 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,

    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new AppError('Token invalid or expired', 400));
  }

  user.password = req.body.password;

  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;

  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, req, res);
});

export const updatePassword = catchAsync<'auth'>(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (user) {
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError('Current password wrong', 401));
    }

    user.password = req.body.password;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    createSendToken(user, 200, req, res);
  } else {
    next(new AppError('User not found', 500));
  }
});
