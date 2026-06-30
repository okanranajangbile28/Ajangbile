import { Stripe } from 'stripe';
import Product from '../models/productsModel';
import Order from '../models/orderModel';
import catchAsync from '../utils/catchAsync';
import { createOne } from './handlerFactory';
import { Request, Response } from 'express';
import { CartItem } from '../types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');
export const getCheckoutSession = catchAsync<'auth'>(async (req, res, next) => {
  const cart = await Promise.all(
    req.body.orderItems.map(async (item: CartItem) => {
      const product = await Product.findById(item.productID);

      if (product) return { price: product.priceID, quantity: item.amount };
    }),
  );

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get(
      'host',
    )}/api/order/stripe-payment`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/order`,
    mode: 'payment',
    currency: 'eur',
    shipping_address_collection: { allowed_countries: ['US', 'GB'] },
    shipping_options: [
      { shipping_rate: 'shr_1QLLpH2NYMlugM7ArfJoqMrm' },
      { shipping_rate: 'shr_1QLLoj2NYMlugM7ANulMcDhu' },
    ],
    line_items: cart,
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session: session.url,
  });
});

const createOrder = async (session: Stripe.Checkout.Session) => {
  await Order.create({ session });
};

export const webhookCheckout = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature as string | string[],
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    if (err instanceof Error)
      res.status(400).send(`Webhook error: ${err.message}`);
  }
  // console.log(event.data.object);
  if (event && event.type === 'checkout.session.completed')
    createOrder(event.data.object);

  res.status(200).json({ received: true });
});

export const stripeProduct = catchAsync(async (req, res) => {
  const stripeProductItem = await stripe.products.create({
    name: req.body.productName,
    active: true,
    description: req.body.description,
    images: req.body.images,
  });

  const stripePrice = await stripe.prices.create({
    unit_amount: req.body.price * 100,
    currency: 'eur',
    product: stripeProductItem.id,
  });

  res.json({ id: stripePrice.id });
});

export const shippingRate = catchAsync(async (req, res) => {
  const shr = await stripe.shippingRates.create({
    display_name: req.body.name,
    type: 'fixed_amount',
    fixed_amount: {
      amount: req.body.price,
      currency: 'eur',
    },
  });
  res.json({ shr });
});

export const listShipping = catchAsync(async (req, res) => {
  const response = await stripe.shippingRates.list({});
  res.json({ response });
});
