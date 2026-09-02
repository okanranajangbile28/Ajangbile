import express from 'express';

import {
  getAllOrders,
  getOrder,
  deleteOrder,
  updateOrder,
  getMyOrders,
  orderPerTime,
  percentageChangeOrder,
  aggregateOrders,
  bestSellers,
  createBankTransferOrder,
  submitBankTransferReceipt,
  verifyBankTransferOrder,
} from '../controllers/orderController';

import { protect, restrictTo } from '../controllers/authControllers';

import {
  payStackWebHook,
  updatePayStackOrder,
  verifyOrder,
} from '../controllers/paystackCheckout';

import { captureOrder, createOrder } from '../controllers/paypalCheckout';

// ======================================================
// IMAGE UPLOAD
// ======================================================

import { uploadPhoto, cloudUpload } from '../controllers/imageHandler';

import {
  getCheckoutSession,
  listShipping,
  shippingRate,
  webhookCheckout,
} from '../controllers/stripeCheckout';

const router = express.Router();

// ======================================================
// USER ORDER HISTORY
// ======================================================

router.get('/myOrders', getMyOrders);

// ======================================================
// PAYSTACK
// ======================================================

router.post('/paystack/webhook', payStackWebHook);

// ======================================================
// PAYPAL
// ======================================================

router.route('/paypal').post(createOrder);

router.route('/paypal/:orderID/pay').post(captureOrder);

// ======================================================
// STRIPE CHECKOUT
// ======================================================

router.route('/stripe-checkout').post(getCheckoutSession);

// ======================================================
// BANK TRANSFER RECEIPT UPLOAD
// ======================================================
//
// Step 1:
// Customer uploads the payment receipt.
//
// POST:
// /api/order/bank-transfer/receipt
//
// FormData:
// image = receipt image
//
// uploadPhoto()
//      ↓
// cloudUpload()
//      ↓
// Cloudinary
//
// This route returns the Cloudinary receipt URL.
//
// ======================================================

router.post(
  '/bank-transfer/receipt',
  uploadPhoto(),
  cloudUpload('bank-transfer-receipts'),
  (req, res) => {
    const receiptUrl = req.body.images?.[0];

    if (!receiptUrl) {
      res.status(400).json({
        status: 'fail',
        message: 'Payment receipt upload failed.',
      });

      return;
    }

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Payment receipt uploaded successfully.',
      receiptUrl,
      url: receiptUrl,
      data: {
        receiptUrl,
        url: receiptUrl,
      },
    });
  },
);

// ======================================================
// BANK TRANSFER ORDER
// ======================================================
//
// Customer creates the order after providing:
// - Cart
// - Shipping information
// - Bank transfer receipt
//
// POST:
// /api/order/bank-transfer
//
// ======================================================

router.post('/bank-transfer', createBankTransferOrder);

// ======================================================
// SUBMIT RECEIPT TO EXISTING BANK TRANSFER ORDER
// ======================================================
//
// If the order already exists and the customer needs
// to attach/update the receipt:
//
// PATCH:
// /api/order/bank-transfer/:orderReference
//
// Body:
// {
//   receiptUrl: "https://res.cloudinary.com/..."
// }
//
// ======================================================

router.patch('/bank-transfer/:orderReference', submitBankTransferReceipt);

// ======================================================
// ADMIN VERIFY BANK TRANSFER PAYMENT
// ======================================================
//
// PATCH:
// /api/order/bank-transfer/:orderId/verify
//
// Only authenticated admin/developer users can verify.
//
// When verified:
// - bankTransferStatus = Verified
// - paymentInfo.status = paid
// - paidAt is recorded
// - bankTransferVerifiedAt is recorded
// - bankTransferVerifiedBy is recorded
// - customer confirmation email is sent
//
// ======================================================

router.patch(
  '/bank-transfer/:orderId/verify',
  protect,
  restrictTo('admin', 'developer'),
  verifyBankTransferOrder,
);

// ======================================================
// STRIPE WEBHOOK
// ======================================================
//
// Stripe calls this endpoint after checkout.
//
// IMPORTANT:
// This route must remain available without normal
// authentication because Stripe itself calls it.
//
// ======================================================

router.route('/stripe/webhook').post(webhookCheckout);

// ======================================================
// PAYSTACK ADMIN / VERIFICATION
// ======================================================

router.route('/paystack/verify/:reference').get(verifyOrder);

router.route('/paystack/:id').patch(updatePayStackOrder);

// ======================================================
// STRIPE SHIPPING
// ======================================================

router.route('/stripe/shipping').get(listShipping).post(shippingRate);

// ======================================================
// ORDERS
// ======================================================
//
// NOTE:
// These routes are intentionally left as they currently
// work in your application.
//
// Admin protection can be applied separately if needed.
//
// ======================================================

router.route('/').get(getAllOrders);

router.get('/totalOrder', orderPerTime);

router.get('/aggregateOrder', aggregateOrders);

router.get('/bestSellers', bestSellers);

router.get('/pctChange', percentageChangeOrder);

// ======================================================
// SINGLE ORDER
// ======================================================

router.route('/:id').get(getOrder).delete(deleteOrder).patch(updateOrder);

// ======================================================
// EXPORT
// ======================================================

export default router;
