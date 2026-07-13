/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import AppError from '../utils/appError';

const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.keyValue
    ? Object.values(err.keyValue).join(', ')
    : 'Duplicate value';

  return new AppError(
    `Duplicate field value: ${value}. Please use another value.`,
    400,
  );
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  return new AppError(errors.join('. '), 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err: any, req: Request, res: Response): void => {
  console.error('\n================ ERROR ================');
  console.error(err);
  console.error('=======================================\n');

  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    return;
  }

  console.error(err);

  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong.',
  });
};

export default (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
    return;
  }

  let error: any = { ...err };

  error.message = err.message;
  error.name = err.name;
  error.code = err.code;

  if (error.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  if (error.name === 'ValidationError') {
    error = handleValidationErrorDB(err);
  }

  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  sendErrorProd(error, req, res);
};
