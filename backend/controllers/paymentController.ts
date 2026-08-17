import Stripe from 'stripe';
import { Request, Response } from 'express';
import MembershipApplication from '../models/membershipApplicationModel';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ======================================================
// MEMBERSHIP APPLICATION FEE
//
// Amount is in cents because Stripe expects the smallest
// currency unit.
//
// CHANGE THIS VALUE TO YOUR ACTUAL APPLICATION FEE.
// Example:
// 5000 = $50.00
// 10000 = $100.00
// ======================================================

const APPLICATION_FEE_AMOUNT = 500;

// ======================================================
// INITIATION PACKAGE PRICES
// ======================================================

const initiationPackages = {
  Basic: {
    amount: 22400, // $224.00
    name: 'Basic Initiation Package',
    description:
      'Irilẹ̀ (Right of Passage), Ikúta (3rd Day Ritual), Ikojá (7th Day Ritual)',
  },

  Standard: {
    amount: 44000, // $440.00
    name: 'Standard Initiation Package',
    description:
      'Irilẹ̀ (Right of Passage), Ikúta (3rd Day Ritual), Ikojá (7th Day Ritual), Ibori',
  },

  Premium: {
    amount: 78200, // $782.00
    name: 'Premium Initiation Package',
    description:
      'Irilẹ̀ (Right of Passage), Ikúta (3rd Day Ritual), Ikojá (7th Day Ritual), Ibori, Eran Oro, Ikorita',
  },
} as const;

type PackageName = keyof typeof initiationPackages;

// ======================================================
// INITIALIZE MEMBERSHIP APPLICATION FEE PAYMENT
//
// The application must already exist before this endpoint
// is called.
// ======================================================

export const initializeApplicationFeePayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!stripe) {
      res.status(500).json({
        success: false,
        message: 'Stripe is not configured.',
      });

      return;
    }

    const applicationId = req.query.applicationId as string;

    if (!applicationId) {
      res.status(400).json({
        success: false,
        message: 'Missing application ID.',
      });

      return;
    }

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    // Prevent unnecessary new payment sessions
    if (application.applicationFeeStatus === 'Paid') {
      res.status(400).json({
        success: false,
        message: 'The membership application fee has already been paid.',
      });

      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: ['card'],

      customer_email: application.email,

      line_items: [
        {
          price_data: {
            currency: 'usd',

            product_data: {
              name: 'Membership Application Fee',

              description:
                'Membership application processing fee for Ajangbile Heritage.',

              metadata: {
                applicationId: String(application._id),
                paymentType: 'application_fee',
              },
            },

            unit_amount: APPLICATION_FEE_AMOUNT,
          },

          quantity: 1,
        },
      ],

      billing_address_collection: 'required',

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        applicationId: String(application._id),
        paymentType: 'application_fee',
      },

      success_url:
        `${process.env.CLIENT_URL}/payment-success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/become-member`,
    });

    if (!session.url) {
      res.status(500).json({
        success: false,
        message: 'Stripe checkout URL was not created.',
      });

      return;
    }

    // Save the Stripe Checkout Session ID temporarily
    application.applicationFeeReference = session.id;

    application.applicationFeeAmount = APPLICATION_FEE_AMOUNT / 100;

    await application.save();

    res.redirect(session.url);
  } catch (error: any) {
    console.error('❌ Stripe application fee error:');
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error?.message ||
        'Unable to initialize membership application payment.',
    });
  }
};

// ======================================================
// INITIALIZE MEMBERSHIP INITIATION PAYMENT
// ======================================================

export const initializeInitiationPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!stripe) {
      res.status(500).json({
        success: false,
        message: 'Stripe is not configured.',
      });

      return;
    }

    const applicationId = req.query.applicationId as string;
    const packageName = req.query.package as PackageName;

    if (!applicationId || !packageName) {
      res.status(400).json({
        success: false,
        message: 'Missing applicationId or package.',
      });

      return;
    }

    if (!(packageName in initiationPackages)) {
      res.status(400).json({
        success: false,
        message: 'Invalid initiation package.',
      });

      return;
    }

    const selectedPackage = initiationPackages[packageName];

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    // Application must be approved before initiation payment
    if (application.status !== 'Accepted') {
      res.status(400).json({
        success: false,
        message:
          'This membership application has not been approved for initiation payment.',
      });

      return;
    }

    if (application.paymentStatus === 'Paid') {
      res.status(400).json({
        success: false,
        message: 'Initiation payment has already been completed.',
      });

      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: ['card'],

      customer_email: application.email,

      line_items: [
        {
          price_data: {
            currency: 'usd',

            product_data: {
              name: selectedPackage.name,

              description: selectedPackage.description,

              metadata: {
                applicationId: String(application._id),
                packageName,
                paymentType: 'initiation_fee',
              },
            },

            unit_amount: selectedPackage.amount,
          },

          quantity: 1,
        },
      ],

      billing_address_collection: 'required',

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        applicationId: String(application._id),
        packageName,
        paymentType: 'initiation_fee',
      },

      success_url:
        `${process.env.CLIENT_URL}/payment-success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/ogboni-login`,
    });

    if (!session.url) {
      res.status(500).json({
        success: false,
        message: 'Stripe checkout URL was not created.',
      });

      return;
    }

    application.initiationPackage = packageName;

    application.paymentAmount = selectedPackage.amount / 100;

    application.paymentReference = session.id;

    await application.save();

    res.redirect(session.url);
  } catch (error: any) {
    console.error('❌ Stripe initiation payment error:');
    console.error(error);

    res.status(500).json({
      success: false,
      message: error?.message || 'Unable to initialize initiation payment.',
    });
  }
};

// ======================================================
// STRIPE MEMBERSHIP PAYMENT WEBHOOK
//
// Handles BOTH:
//
// 1. application_fee
// 2. initiation_fee
// ======================================================

export const stripeInitiationWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!stripe) {
    res.status(500).json({
      success: false,
      message: 'Stripe is not configured.',
    });

    return;
  }

  const signature = req.headers['stripe-signature'];

  if (!signature) {
    res.status(400).json({
      success: false,
      message: 'Missing Stripe signature.',
    });

    return;
  }

  const webhookSecret = process.env.STRIPE_MEMBERSHIP_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_MEMBERSHIP_WEBHOOK_SECRET is missing.');

    res.status(500).json({
      success: false,
      message: 'Stripe membership webhook secret is not configured.',
    });

    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error(
      '❌ Stripe membership webhook signature verification failed.',
    );

    console.error(error);

    res.status(400).json({
      success: false,
      message: 'Invalid Stripe webhook signature.',
    });

    return;
  }

  console.log(`🔔 Membership Stripe event received: ${event.type}`);

  // ==================================================
  // CHECKOUT COMPLETED
  // ==================================================

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const applicationId = session.metadata?.applicationId;

    const paymentType = session.metadata?.paymentType;

    const packageName = session.metadata?.packageName;

    if (!applicationId || !paymentType) {
      console.error('❌ Stripe session is missing required metadata.');

      res.status(400).json({
        success: false,
        message: 'Payment metadata is missing.',
      });

      return;
    }

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      console.error('❌ Membership application not found:', applicationId);

      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    const amountPaid = (session.amount_total || 0) / 100;

    const paymentReference = session.payment_intent
      ? String(session.payment_intent)
      : session.id;

    // ==================================================
    // APPLICATION FEE PAYMENT
    // ==================================================

    if (paymentType === 'application_fee') {
      if (application.applicationFeeStatus === 'Paid') {
        console.log('⚠️ Application fee already processed:', applicationId);
      } else {
        application.applicationFeeStatus = 'Paid';

        application.applicationFeeAmount = amountPaid;

        application.applicationFeeReference = paymentReference;

        application.applicationFeeDate = new Date();

        await application.save();

        console.log('======================================');
        console.log('✅ APPLICATION FEE PAYMENT CONFIRMED');
        console.log(`Application ID: ${applicationId}`);
        console.log(`Stripe Session: ${session.id}`);
        console.log(`Amount Paid: $${amountPaid.toFixed(2)}`);
        console.log(`Email: ${application.email}`);
        console.log('======================================');
      }
    }

    // ==================================================
    // INITIATION PAYMENT
    // ==================================================

    if (paymentType === 'initiation_fee') {
      if (application.paymentStatus === 'Paid') {
        console.log('⚠️ Initiation payment already processed:', applicationId);
      } else {
        application.paymentStatus = 'Paid';

        application.paymentReference = paymentReference;

        application.paymentDate = new Date();

        application.paymentAmount = amountPaid;

        if (
          packageName === 'Basic' ||
          packageName === 'Standard' ||
          packageName === 'Premium'
        ) {
          application.initiationPackage = packageName;
        }

        application.status = 'Paid';

        await application.save();

        console.log('======================================');
        console.log('✅ INITIATION PAYMENT CONFIRMED');
        console.log(`Application ID: ${applicationId}`);
        console.log(`Stripe Session: ${session.id}`);
        console.log(`Package: ${packageName}`);
        console.log(`Amount Paid: $${amountPaid.toFixed(2)}`);
        console.log(`Email: ${application.email}`);
        console.log('======================================');
      }
    }
  }

  // ==================================================
  // PAYMENT FAILED
  // ==================================================

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log('❌ Membership Stripe payment failed:', paymentIntent.id);
  }

  res.status(200).json({
    success: true,
    received: true,
  });
};

// ======================================================
// VERIFY PAYMENT
//
// This supports both application fee and initiation
// payments.
//
// The Stripe webhook remains the primary source of truth.
// ======================================================

export const verifyPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!stripe) {
      res.status(500).json({
        success: false,
        message: 'Stripe is not configured.',
      });

      return;
    }

    const sessionId =
      (req.query.session_id as string) || (req.query.sessionId as string);

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: 'Stripe session ID missing.',
      });

      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      res.status(400).json({
        success: false,
        message: 'Payment has not been completed.',
      });

      return;
    }

    const applicationId = session.metadata?.applicationId;

    const paymentType = session.metadata?.paymentType;

    if (!applicationId || !paymentType) {
      res.status(400).json({
        success: false,
        message: 'Payment metadata is missing.',
      });

      return;
    }

    const application = await MembershipApplication.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Membership application not found.',
      });

      return;
    }

    const amountPaid = (session.amount_total || 0) / 100;

    const paymentReference = session.payment_intent
      ? String(session.payment_intent)
      : session.id;

    // ==================================================
    // VERIFY APPLICATION FEE
    // ==================================================

    if (
      paymentType === 'application_fee' &&
      application.applicationFeeStatus !== 'Paid'
    ) {
      application.applicationFeeStatus = 'Paid';

      application.applicationFeeAmount = amountPaid;

      application.applicationFeeReference = paymentReference;

      application.applicationFeeDate = new Date();

      await application.save();
    }

    // ==================================================
    // VERIFY INITIATION PAYMENT
    // ==================================================

    if (
      paymentType === 'initiation_fee' &&
      application.paymentStatus !== 'Paid'
    ) {
      application.paymentStatus = 'Paid';

      application.paymentReference = paymentReference;

      application.paymentDate = new Date();

      application.paymentAmount = amountPaid;

      const packageName = session.metadata?.packageName;

      if (
        packageName === 'Basic' ||
        packageName === 'Standard' ||
        packageName === 'Premium'
      ) {
        application.initiationPackage = packageName;
      }

      application.status = 'Paid';

      await application.save();
    }

    res.redirect(`${process.env.CLIENT_URL}/payment-success`);
  } catch (error: any) {
    console.error('❌ Stripe payment verification error:');
    console.error(error);

    res.status(500).json({
      success: false,
      message: error?.message || 'Unable to verify payment.',
    });
  }
};
