import Stripe from 'stripe';
import { Request, Response } from 'express';

import Consultation from '../models/consultationModel';
import Pricing from '../models/pricingModel';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ======================================================
// CONSULTATION DETAILS
// Prices now come from the central Pricing model.
// ======================================================

const consultationDetails = {
  Opele: {
    name: 'Opele Consultation',
    description:
      'A traditional Opele consultation for spiritual guidance, clarity and insight.',
  },

  Ikin: {
    name: 'Ikin Consultation',
    description:
      'A deeper Ikin consultation for those seeking comprehensive spiritual guidance.',
  },

  OneHour: {
    name: '1-Hour Consultation & Discussion',
    description:
      'A private one-hour consultation and discussion for detailed spiritual guidance, questions and personal matters.',
  },
} as const;

type ConsultationType = keyof typeof consultationDetails;

// ======================================================
// WHATSAPP NUMBER
// ======================================================

const WHATSAPP_NUMBER = '2349023323697';

// ======================================================
// GET CURRENT CENTRAL PRICING
// ======================================================

const getCurrentPricing = async () => {
  let pricing = await Pricing.findOne();

  if (!pricing) {
    pricing = await Pricing.create({});
  }

  return pricing;
};

// ======================================================
// GET CONSULTATION PRICE
// ======================================================

const getConsultationPrice = async (
  consultationType: ConsultationType,
): Promise<number> => {
  const pricing = await getCurrentPricing();

  const prices: Record<ConsultationType, number> = {
    Opele: pricing.opeleConsultation,
    Ikin: pricing.ikinConsultation,
    OneHour: pricing.oneHourConsultation,
  };

  return prices[consultationType];
};

// ======================================================
// START STRIPE CONSULTATION PAYMENT
// ======================================================

export const initializeConsultationPayment = async (
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

    const consultationType = req.query.type as ConsultationType;

    if (!consultationType || !(consultationType in consultationDetails)) {
      res.status(400).json({
        success: false,
        message: 'Invalid consultation type.',
      });

      return;
    }

    const consultation = consultationDetails[consultationType];

    // ==================================================
    // GET CURRENT PRICE FROM CENTRAL PRICING
    // ==================================================

    const amountUSD = await getConsultationPrice(consultationType);

    const amountInCents = Math.round(amountUSD * 100);

    // ==================================================
    // CREATE STRIPE CHECKOUT SESSION
    // ==================================================

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: ['card'],

      line_items: [
        {
          price_data: {
            currency: 'usd',

            product_data: {
              name: consultation.name,

              description: consultation.description,

              metadata: {
                paymentType: 'consultation',
                consultationType,
              },
            },

            unit_amount: amountInCents,
          },

          quantity: 1,
        },
      ],

      billing_address_collection: 'required',

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        paymentType: 'consultation',
        consultationType,
      },

      success_url:
        `${process.env.CLIENT_URL}/consultation-payment-success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/consultation`,
    });

    if (!session.url) {
      res.status(500).json({
        success: false,
        message: 'Stripe checkout URL was not created.',
      });

      return;
    }

    // ==================================================
    // SAVE PENDING CONSULTATION
    // ==================================================

    await Consultation.create({
      consultationType,

      consultationName: consultation.name,

      amount: amountUSD,

      currency: 'USD',

      paymentMethod: 'stripe',

      paymentStatus: 'pending',

      stripeSessionId: session.id,
    });

    console.log('✅ Consultation request created:', session.id);
    console.log(`💰 Consultation amount: $${amountUSD.toFixed(2)}`);

    // ==================================================
    // REDIRECT CUSTOMER TO STRIPE
    // ==================================================

    res.redirect(session.url);
  } catch (error: unknown) {
    console.error('❌ Stripe consultation payment error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to initialize consultation payment.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// VERIFY STRIPE CONSULTATION PAYMENT
// ======================================================

export const verifyConsultationPayment = async (
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
        message: 'Stripe session ID is missing.',
      });

      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      res.status(400).json({
        success: false,
        paid: false,
        message: 'Consultation payment has not been completed.',
      });

      return;
    }

    const paymentType = session.metadata?.paymentType;

    const consultationType = session.metadata
      ?.consultationType as ConsultationType;

    if (paymentType !== 'consultation' || !consultationType) {
      res.status(400).json({
        success: false,
        message: 'Consultation payment metadata is missing.',
      });

      return;
    }

    if (!(consultationType in consultationDetails)) {
      res.status(400).json({
        success: false,
        message: 'Invalid consultation type.',
      });

      return;
    }

    const consultation = consultationDetails[consultationType];

    // ==================================================
    // USE ACTUAL STRIPE AMOUNT PAID
    // ==================================================

    const amountPaid = (session.amount_total || 0) / 100;

    const reference =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.id;

    // ==================================================
    // UPDATE CONSULTATION RECORD
    // ==================================================

    await Consultation.findOneAndUpdate(
      {
        stripeSessionId: session.id,
      },
      {
        paymentStatus: 'paid',

        stripePaymentIntentId:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : undefined,

        customerName: session.customer_details?.name || undefined,

        email: session.customer_details?.email || undefined,

        phone: session.customer_details?.phone || undefined,

        // Keep the actual amount paid for historical accuracy.
        amount: amountPaid,
      },
      {
        new: true,
      },
    );

    // ==================================================
    // WHATSAPP MESSAGE
    // ==================================================

    const message =
      `Hello, I have successfully paid for a ${consultation.name}.\n\n` +
      `Consultation Type: ${consultation.name}\n` +
      `Amount Paid: $${amountPaid.toFixed(2)}\n` +
      `Payment Reference: ${reference}\n\n` +
      `I would like to proceed with my consultation.`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,

      paid: true,

      consultationType,

      consultationName: consultation.name,

      amountPaid,

      reference,

      whatsappUrl,
    });
  } catch (error: unknown) {
    console.error('❌ Consultation payment verification error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to verify consultation payment.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// STRIPE CONSULTATION WEBHOOK
// ======================================================

export const consultationStripeWebhook = async (
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

  const webhookSecret = process.env.STRIPE_CONSULTATION_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_CONSULTATION_WEBHOOK_SECRET is missing.');

    res.status(500).json({
      success: false,
      message: 'Stripe consultation webhook secret is not configured.',
    });

    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: unknown) {
    console.error(
      '❌ Consultation Stripe webhook signature verification failed:',
      error,
    );

    res.status(400).json({
      success: false,
      message: 'Invalid Stripe webhook signature.',
    });

    return;
  }

  console.log(`🔔 Consultation Stripe event received: ${event.type}`);

  // ====================================================
  // SUCCESSFUL STRIPE PAYMENT
  // ====================================================

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentType = session.metadata?.paymentType;

    const consultationType = session.metadata
      ?.consultationType as ConsultationType;

    if (paymentType !== 'consultation') {
      res.status(200).json({
        success: true,
        received: true,
      });

      return;
    }

    if (!consultationType || !(consultationType in consultationDetails)) {
      console.error('❌ Invalid consultation type in Stripe webhook.');

      res.status(200).json({
        success: true,
        received: true,
      });

      return;
    }

    const consultation = consultationDetails[consultationType];

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : undefined;

    // ==================================================
    // ACTUAL AMOUNT PAID BY STRIPE
    // ==================================================

    const amountPaid = (session.amount_total || 0) / 100;

    // ==================================================
    // UPDATE CONSULTATION RECORD
    // ==================================================

    const updatedConsultation = await Consultation.findOneAndUpdate(
      {
        stripeSessionId: session.id,
      },
      {
        paymentStatus: 'paid',

        stripePaymentIntentId: paymentIntentId,

        customerName: session.customer_details?.name || undefined,

        email: session.customer_details?.email || undefined,

        phone: session.customer_details?.phone || undefined,

        amount: amountPaid,
      },
      {
        new: true,
      },
    );

    // ==================================================
    // SAFETY FALLBACK
    // ==================================================

    if (!updatedConsultation) {
      await Consultation.create({
        consultationType,

        consultationName: consultation.name,

        customerName: session.customer_details?.name || undefined,

        email: session.customer_details?.email || undefined,

        phone: session.customer_details?.phone || undefined,

        amount: amountPaid,

        currency: 'USD',

        paymentMethod: 'stripe',

        paymentStatus: 'paid',

        stripeSessionId: session.id,

        stripePaymentIntentId: paymentIntentId,
      });
    }

    console.log('======================================');
    console.log('✅ CONSULTATION PAYMENT CONFIRMED');
    console.log(`Stripe Session: ${session.id}`);
    console.log(`Consultation: ${consultation.name}`);
    console.log(`Amount: $${amountPaid.toFixed(2)}`);
    console.log(`Customer: ${session.customer_details?.email || 'Unknown'}`);
    console.log('Payment Status: PAID');
    console.log('======================================');
  }

  // ====================================================
  // FAILED PAYMENT
  // ====================================================

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log('❌ Consultation payment failed:', paymentIntent.id);

    await Consultation.findOneAndUpdate(
      {
        stripePaymentIntentId: paymentIntent.id,
      },
      {
        paymentStatus: 'failed',
      },
    );
  }

  res.status(200).json({
    success: true,
    received: true,
  });
};

// ======================================================
// BANK TRANSFER CONSULTATION PAYMENT
// ======================================================

export const bankTransferConsultation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultationType = req.body.type as ConsultationType;

    if (!consultationType || !(consultationType in consultationDetails)) {
      res.status(400).json({
        success: false,
        message: 'Invalid consultation type.',
      });

      return;
    }

    const consultation = consultationDetails[consultationType];

    // ==================================================
    // GET CURRENT CENTRAL PRICE
    // ==================================================

    const amount = await getConsultationPrice(consultationType);

    // ==================================================
    // RECEIPT
    // ==================================================

    const receipt =
      Array.isArray(req.body.images) && req.body.images.length > 0
        ? req.body.images[0]
        : undefined;

    if (!receipt) {
      res.status(400).json({
        success: false,
        message: 'Payment receipt is required.',
      });

      return;
    }

    // ==================================================
    // CREATE PENDING BANK TRANSFER RECORD
    // ==================================================

    const consultationRecord = await Consultation.create({
      consultationType,

      consultationName: consultation.name,

      amount,

      currency: 'USD',

      paymentMethod: 'bank_transfer',

      paymentStatus: 'pending',

      bankTransferStatus: 'pending',

      bankTransferReceipt: receipt,
    });

    console.log(
      '🏦 Bank transfer consultation created:',
      consultationRecord._id,
    );

    console.log(`💰 Consultation amount: $${amount.toFixed(2)}`);

    console.log('🧾 Consultation receipt:', receipt);

    // ==================================================
    // WHATSAPP MESSAGE
    // ==================================================

    const message =
      `Hello, I have completed a bank transfer for a ${consultation.name}.\n\n` +
      `Consultation Type: ${consultation.name}\n` +
      `Amount: $${amount.toFixed(2)}\n` +
      `Consultation ID: ${consultationRecord._id}\n\n` +
      `My payment receipt has been uploaded for verification.\n\n` +
      `Please confirm my payment and provide the next steps for my consultation.`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,

      consultationId: consultationRecord._id,

      consultationType,

      consultationName: consultation.name,

      amount,

      paymentMethod: 'bank_transfer',

      paymentStatus: 'pending',

      bankTransferStatus: 'pending',

      bankTransferReceipt: receipt,

      bankDetails: {
        bankName: 'Zenith Bank',
        accountName: 'ARUN-UN-TAN LIMITED',
        accountNumber: '1229796653',
      },

      whatsappUrl,
    });
  } catch (error: unknown) {
    console.error('❌ Bank transfer consultation error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to process bank transfer request.';

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// ADMIN - GET PENDING BANK TRANSFER CONSULTATIONS
// ======================================================

export const getPendingConsultationTransfers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const consultations = await Consultation.find({
      paymentMethod: 'bank_transfer',
      bankTransferStatus: 'pending',
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error: unknown) {
    console.error('❌ Get pending consultation transfers error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve pending consultation payments.',
    });
  }
};

// ======================================================
// ADMIN - VERIFY BANK TRANSFER
// ======================================================

export const verifyConsultationBankTransfer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation payment record not found.',
      });

      return;
    }

    if (consultation.paymentMethod !== 'bank_transfer') {
      res.status(400).json({
        success: false,
        message: 'This consultation was not paid by bank transfer.',
      });

      return;
    }

    if (consultation.bankTransferStatus === 'verified') {
      res.status(400).json({
        success: false,
        message: 'This consultation payment has already been verified.',
      });

      return;
    }

    // ==================================================
    // MARK PAYMENT AS VERIFIED
    // ==================================================

    consultation.bankTransferStatus = 'verified';

    consultation.paymentStatus = 'paid';

    consultation.bankTransferDate = consultation.bankTransferDate || new Date();

    await consultation.save();

    console.log('✅ Consultation bank transfer verified:', consultation._id);

    res.status(200).json({
      success: true,
      message: 'Consultation bank transfer verified successfully.',
      consultation,
    });
  } catch (error: unknown) {
    console.error('❌ Verify consultation transfer error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to verify consultation payment.',
    });
  }
};

// ======================================================
// ADMIN - REJECT BANK TRANSFER
// ======================================================

export const rejectConsultationBankTransfer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation payment record not found.',
      });

      return;
    }

    if (consultation.paymentMethod !== 'bank_transfer') {
      res.status(400).json({
        success: false,
        message: 'This consultation was not paid by bank transfer.',
      });

      return;
    }

    if (consultation.bankTransferStatus === 'verified') {
      res.status(400).json({
        success: false,
        message: 'A verified consultation payment cannot be rejected.',
      });

      return;
    }

    // ==================================================
    // MARK PAYMENT AS REJECTED
    // ==================================================

    consultation.bankTransferStatus = 'rejected';

    consultation.paymentStatus = 'failed';

    await consultation.save();

    console.log('❌ Consultation bank transfer rejected:', consultation._id);

    res.status(200).json({
      success: true,
      message: 'Consultation bank transfer rejected.',
      consultation,
    });
  } catch (error: unknown) {
    console.error('❌ Reject consultation transfer error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to reject consultation payment.',
    });
  }
};
