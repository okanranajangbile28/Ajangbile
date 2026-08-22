import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { sendContactFormEmail } from '../utils/sendEmail';

export const sendContactMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      throw new AppError('Please fill all required fields.', 400);
    }

    await sendContactFormEmail({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  },
);
