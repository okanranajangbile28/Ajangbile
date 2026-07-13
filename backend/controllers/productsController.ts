import { Stripe } from 'stripe';

import Product from '../models/productsModel';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import { getOne } from './handlerFactory';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/* ==========================================================
   CREATE PRODUCT
========================================================== */

export const uploadProduct = catchAsync(async (req, res, next) => {
  console.log('\n========================================');
  console.log('🚀 CREATE PRODUCT');
  console.log('========================================');

  console.log('BODY');
  console.dir(req.body, { depth: null });

  console.log('FILES');
  console.dir(req.files, { depth: null });

  if (!req.body.productName)
    return next(new AppError('Product name is required.', 400));

  if (!req.body.description)
    return next(new AppError('Description is required.', 400));

  if (!req.body.price) return next(new AppError('Price is required.', 400));

  if (!req.body.category)
    return next(new AppError('Category is required.', 400));

  if (!req.body.images || req.body.images.length === 0) {
    return next(new AppError('Please upload at least one image.', 400));
  }

  req.body.price = Number(req.body.price);
  req.body.discount = Number(req.body.discount || 0);
  req.body.totalQuantity = Number(req.body.totalQuantity || 0);

  if (stripe) {
    console.log('Creating Stripe Product...');

    const stripeProduct = await stripe.products.create({
      name: req.body.productName,
      description: req.body.description,
      active: true,
    });

    const stripePrice = await stripe.prices.create({
      unit_amount: req.body.price * 100,
      currency: 'eur',
      product: stripeProduct.id,
    });

    req.body.priceID = stripePrice.id;
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: product,
  });
});

/* ==========================================================
   GET ALL PRODUCTS
========================================================== */

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find().sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products,
  });
});

/* ==========================================================
   GET SINGLE PRODUCT
========================================================== */

export const getProduct = getOne(Product);

/* ==========================================================
   UPDATE PRODUCT
========================================================== */

export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  // IMPORTANT:
  // If no new image was uploaded,
  // keep the existing Cloudinary images.
  if (!req.body.images || req.body.images.length === 0) {
    delete req.body.images;
  }

  if (req.body.price) {
    req.body.price = Number(req.body.price);
  }

  if (req.body.discount) {
    req.body.discount = Number(req.body.discount);
  }

  if (req.body.totalQuantity) {
    req.body.totalQuantity = Number(req.body.totalQuantity);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: updatedProduct,
  });
});

/* ==========================================================
   DELETE PRODUCT
========================================================== */

export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  product.active = false;

  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully.',
  });
});
