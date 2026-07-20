import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendMail } from '../utils/email';
import AppError from '../utils/appError';

export const sendContactMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      throw new AppError('Please fill all required fields.', 400);
    }

    const date = new Date().toLocaleString('en-NG', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Africa/Lagos',
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.8">
        <h2 style="color:#4b0082;">
          New Contact Form Message
        </h2>

        <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;width:100%;">
          <tr>
            <td><strong>First Name</strong></td>
            <td>${firstName}</td>
          </tr>

          <tr>
            <td><strong>Last Name</strong></td>
            <td>${lastName}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Phone</strong></td>
            <td>${phone}</td>
          </tr>

          <tr>
            <td><strong>Subject</strong></td>
            <td>${subject || 'No Subject'}</td>
          </tr>

          <tr>
            <td><strong>Date Submitted</strong></td>
            <td>${date}</td>
          </tr>
        </table>

        <br/>

        <h3>Message</h3>

        <div
          style="
            background:#f7f7f7;
            padding:20px;
            border-radius:8px;
            white-space:pre-wrap;
          "
        >
${message}
        </div>
      </div>
    `;

    await sendMail({
      to: 'ajangbileheritage007@gmail.com',
      subject: `Website Contact: ${subject || 'New Message'}`,
      html,
      replyTo: email,
    });
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  },
);
