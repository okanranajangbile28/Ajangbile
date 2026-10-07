import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import OgboniMember from '../models/OgboniMember';
import AppError from '../utils/appError';

const verifyToken = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(decoded as JwtPayload);
    });
  });
};

export const protectOgboniMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You must be logged in as an Ogboni member.', 401),
      );
    }

    // Verify JWT
    const decoded = await verifyToken(token, process.env.JWT_SECRET as string);

    // Make sure this token belongs to an Ogboni member
    if (decoded.type !== 'ogboni-member') {
      return next(new AppError('Invalid Ogboni member authentication.', 401));
    }

    // Find the member
    const member = await OgboniMember.findById(decoded.id);

    if (!member) {
      return next(new AppError('Ogboni member account no longer exists.', 401));
    }

    // Make sure the member is still approved
    if (!member.approved) {
      return next(
        new AppError('Your Ogboni membership is no longer approved.', 403),
      );
    }

    // Attach member to request
    req.ogboniMember = member;

    next();
  } catch (error) {
    console.error('Ogboni authentication error:', error);

    return next(new AppError('Invalid or expired Ogboni member session.', 401));
  }
};
