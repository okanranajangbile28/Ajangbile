import { Stripe } from 'stripe';
import Product from '../models/productsModel';
import catchAsync from '../utils/catchAsync';
import { CartItem } from '../types';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ===============================
// STRIPE CHECKOUT
// ===============================

export const getCheckoutSession = catchAsync(async (req, res) => {
  if (!stripe) {
    res.status(500).json({
      status: 'error',
      message: 'Stripe is not configured yet.',
    });
    return;
  }

  const cart = await Promise.all(
    req.body.orderItems.map(async (item: CartItem) => {
      const product = await Product.findById(item.productID);

      if (!product) return null;

      return {
        price_data: {
          currency: 'ngn',

          product_data: {
            name: product.productName,
            images: product.images,
          },

          unit_amount: Math.round(product.price * 100),
        },

        quantity: item.amount,
      };
    }),
  );

  const validCart = cart.filter(
    Boolean,
  ) as Stripe.Checkout.SessionCreateParams.LineItem[];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    mode: 'payment',

    line_items: validCart,

    success_url: `${process.env.CLIENT_URL}/order-success`,

    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.status(200).json({
    status: 'success',
    session: session.url,
  });
});

// ===============================
// TEMP STRIPE FUNCTIONS
// Needed by orderRoute.ts
// ===============================

export const webhookCheckout = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Stripe webhook placeholder',
  });
});

export const stripeProduct = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Stripe product creation placeholder',
  });
});

export const shippingRate = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Shipping rate placeholder',
  });
});

export const listShipping = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Shipping list placeholder',
  });
});
