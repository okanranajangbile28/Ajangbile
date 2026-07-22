import axios from 'axios';
import crypto from 'crypto';
import { Request, Response } from 'express';

import MembershipApplication from '../models/membershipApplicationModel';

export const initializeInitiationPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applicationId = req.query.applicationId as string;
    const packageName = req.query.package as string;

    if (!applicationId || !packageName) {
      res.status(400).json({
        success: false,
        message: 'Missing applicationId or package.',
      });
      return;
    }

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
      return;
    }

    // Dollar prices (display only)

    // Temporary NGN equivalents for Paystack
    const ngnPrices = {
      Basic: 300000,
      Standard: 600000,
      Premium: 1000000,
    };

    const amount = ngnPrices[packageName as keyof typeof ngnPrices];

    if (!amount) {
      res.status(400).json({
        success: false,
        message: 'Invalid package.',
      });
      return;
    }

    const paymentReference = `AJG-${crypto
      .randomBytes(10)
      .toString('hex')
      .toUpperCase()}`;

    application.initiationPackage = packageName as
      | 'Basic'
      | 'Standard'
      | 'Premium';

    application.paymentAmount = amount;

    application.paymentReference = paymentReference;

    await application.save();

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: application.email,

        amount: amount * 100,

        reference: paymentReference,

        callback_url: 'https://ajangbile.onrender.com/api/payments/verify',

        metadata: {
          applicationId,
          packageName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    res.redirect(response.data.data.authorization_url);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verifyPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reference = req.query.reference as string;

    if (!reference) {
      res.status(400).json({
        success: false,
        message: 'Payment reference missing.',
      });
      return;
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const payment = response.data.data;

    if (payment.status !== 'success') {
      res.status(400).json({
        success: false,
        message: 'Payment not successful.',
      });
      return;
    }

    const applicationId = payment.metadata.applicationId;

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
      return;
    }

    application.paymentStatus = 'Paid';

    application.paymentReference = payment.reference;

    application.paymentDate = new Date(payment.paid_at);

    application.paymentAmount = payment.amount / 100;

    application.initiationPackage = payment.metadata.packageName;

    application.status = 'Paid';

    await application.save();

    res.redirect('https://www.ajangbileheritage.com/payment-success');
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
