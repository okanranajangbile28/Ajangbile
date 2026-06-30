/* eslint-disable node/no-unsupported-features/es-syntax */
import { CastError, Error, MongooseError } from 'mongoose';
import AppError from '../utils/appError';
import { NextFunction, Request, Response } from 'express';

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongooseError) => {
  const matchResult = err.message.match(/(["'])(\\?.)*?\1/);
  const value = matchResult ? matchResult[0] : 'unknown';

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

export const sendErrorDev = (
  err: AppError,
  req: Request,
  res: Response,
): void => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    // You can handle rendering the error page for the website here
  }
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error: AppError = { ...err };
    error.message = err.message;

    if (error.name === 'CastError' && error instanceof Error.CastError)
      error = handleCastErrorDB(error);
    if (error.statusCode === 11000) error = handleDuplicateFieldsDB(error);
    if (
      error.name === 'ValidationError' &&
      error instanceof Error.ValidationError
    )
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
