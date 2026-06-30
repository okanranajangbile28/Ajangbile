import express from 'express';
// import csrf from 'csurf';
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
} from '../controllers/orderController';
import { protect, restrictTo } from '../controllers/authControllers';
import {
  payStackWebHook,
  updatePayStackOrder,
  verifyOrder,
} from '../controllers/paystackCheckout';
import { captureOrder, createOrder } from '../controllers/paypalCheckout';
// const csrfProtection = csrf({ cookie: true });
import {
  getCheckoutSession,
  listShipping,
  shippingRate,
  stripeProduct,
  webhookCheckout,
} from '../controllers/stripeCheckout';

const router = express.Router();

//user order history
router.get('/myOrders', getMyOrders);

//get Total Amount for a particular period

//paystack user actions]\\
// router.post('/paystack/checkout-session', csrfProtection, getCheckoutSession);
router.post('/paystack/webhook', payStackWebHook);

//paypal user actions
router.route('/paypal').post(createOrder);
router.route('/paypal/:orderID/pay').post(captureOrder);

// stripe user actions
router.route('/stripe-checkout').post(getCheckoutSession);
router.route('/stripe/webhook').post(webhookCheckout);
// router.route('/stripe-create').post(stripeProduct);
// router.route('//stripe-payment').post(stripeOrder);

// router.use(protect);
// router.use(restrictTo('admin'));

router.route('/paystack/verify/:reference').get(verifyOrder);
router.route('/paystack/:id').patch(updatePayStackOrder);

router.route('/stripe/shipping').get(listShipping).post(shippingRate);

router.route('/').get(getAllOrders);
router.get('/totalOrder', orderPerTime);
router.get('/aggregateOrder', aggregateOrders);
router.get('/bestSellers', bestSellers);

router.get('/pctChange', percentageChangeOrder);
router.route('/:id').get(getOrder).delete(deleteOrder).patch(updateOrder);

export default router;
