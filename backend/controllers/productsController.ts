// eslint-disable-next-line import/no-extraneous-dependencies
import { Stripe } from 'stripe';
import Product from '../models/productsModel';
import catchAsync from '../utils/catchAsync';
import { getAll, getOne, updateOne } from './handlerFactory';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const uploadProduct = catchAsync(async (req, res) => {
  if (stripe) {
    const stripeProduct = await stripe.products.create({
      name: req.body.productName,
      active: true,
      description: req.body.description,
      images: req.body.images,
    });

    const stripePrice = await stripe.prices.create({
      unit_amount: req.body.price * 100,
      currency: 'eur',
      product: stripeProduct.id,
    });

    req.body.priceID = stripePrice.id;
  }

  const response = await Product.create(req.body);

  res.status(201).json({ response });
});
export const deleteProduct = catchAsync(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getAllProducts = getAll(Product);
export const getProduct = getOne(Product);
export const updateProduct = updateOne(Product);
