import moment from 'moment';
import crypto from 'crypto';
import { Request, Response } from 'express';

import Order from '../models/orderModel';
import Product from '../models/productsModel';
import catchAsync from '../utils/catchAsync';
import { sendOrderReceiptEmail } from '../utils/sendEmail';

import {
  deleteOne,
  getAll,
  getMine,
  getOne,
  getTotalModelPerTime,
  percentageChangeModel,
  updateOne,
} from './handlerFactory';

import { CartItem, PeriodKey } from '../types';

// ======================================================
// ORDER STATISTICS
// ======================================================

export const orderPerTime = getTotalModelPerTime(Order, [
  {
    field: 'Total Items Ordered',
    acc: '$total_items',
  },
  {
    field: 'Total Sale',
    acc: '$total_amount',
  },
]);

export const percentageChangeOrder = percentageChangeModel(Order, [
  {
    field: 'Total Items Ordered',
    acc: '$total_items',
  },
  {
    field: 'Total Sale',
    acc: '$total_amount',
  },
  {
    field: 'Total Orders',
    acc: 1,
  },
]);

// ======================================================
// PICK TIME
// ======================================================

const pickTime = (
  period: PeriodKey,
  start: moment.unitOfTime.StartOf,
  end: moment.unitOfTime.StartOf,
) => {
  let dateFilter = {};

  // ----------------------------------------------------
  // DAILY
  // ----------------------------------------------------

  if (period === 'daily') {
    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    endOfDay.setHours(23, 59, 59, 999);

    dateFilter = {
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };
  }

  // ----------------------------------------------------
  // WEEKLY
  // ----------------------------------------------------

  if (period === 'weekly') {
    const today = new Date();

    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(0, 0, 0, 0);

    dateFilter = {
      createdAt: {
        $gte: startOfWeek,
        $lt: endOfWeek,
      },
    };
  }

  // ----------------------------------------------------
  // MONTHLY
  // ----------------------------------------------------

  if (period === 'monthly') {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    dateFilter = {
      createdAt: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    };
  }

  // ----------------------------------------------------
  // YEARLY
  // ----------------------------------------------------

  if (period === 'yearly') {
    const now = new Date();

    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    dateFilter = {
      createdAt: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    };
  }

  // ----------------------------------------------------
  // CUSTOM
  // ----------------------------------------------------

  if (period === 'custom') {
    dateFilter = {
      createdAt: {
        $gte: moment(start, 'DD/MM/YYYY').startOf('day').toDate(),

        $lte: moment(end, 'DD/MM/YYYY').endOf('day').toDate(),
      },
    };
  }

  return dateFilter;
};

// ======================================================
// AGGREGATE ORDERS
// ======================================================

export const aggregateOrders = catchAsync(
  async (req: Request, res: Response) => {
    const data = await Order.aggregate([
      {
        $match: pickTime(
          req.query.period as PeriodKey,
          req.query.customTimeStart as moment.unitOfTime.StartOf,
          req.query.customTimeEnd as moment.unitOfTime.StartOf,
        ),
      },

      {
        $unwind: '$orderItems',
      },

      {
        $unwind: '$orderItems.sizes',
      },

      {
        $group: {
          _id: {
            productName: '$orderItems.productName',
            size: '$orderItems.sizes.size',
          },

          totalQuantity: {
            $sum: '$orderItems.sizes.quantity',
          },
        },
      },

      {
        $group: {
          _id: '$_id.productName',

          sizes: {
            $push: {
              size: '$_id.size',
              quantity: '$totalQuantity',
            },
          },
        },
      },

      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'productName',
          as: 'productDetails',
        },
      },

      {
        $unwind: '$productDetails',
      },

      {
        $group: {
          _id: '$productDetails.collectionName',

          totalItemsSold: {
            $sum: {
              $sum: '$sizes.quantity',
            },
          },

          products: {
            $push: {
              productName: '$_id',
              sizes: '$sizes',
              images: '$productDetails.images',
              price: '$productDetails.price',
            },
          },
        },
      },
    ]);

    res.status(200).json({
      data,
    });
  },
);

// ======================================================
// BEST SELLERS
// ======================================================

export const bestSellers = catchAsync(async (req: Request, res: Response) => {
  const data = await Order.aggregate([
    {
      $match: pickTime(
        req.query.period as PeriodKey,
        req.query.customTimeStart as moment.unitOfTime.StartOf,
        req.query.customTimeEnd as moment.unitOfTime.StartOf,
      ),
    },

    {
      $unwind: '$orderItems',
    },

    {
      $unwind: '$orderItems.sizes',
    },

    {
      $group: {
        _id: {
          productName: '$orderItems.productName',
          size: '$orderItems.sizes.size',
        },

        totalQuantity: {
          $sum: '$orderItems.sizes.quantity',
        },
      },
    },

    {
      $group: {
        _id: '$_id.productName',

        sizes: {
          $push: {
            size: '$_id.size',
            quantity: '$totalQuantity',
          },
        },

        totalQuantitySold: {
          $sum: '$totalQuantity',
        },
      },
    },

    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'productName',
        as: 'productDetails',
      },
    },

    {
      $unwind: '$productDetails',
    },

    {
      $project: {
        productName: '$_id',
        totalQuantitySold: 1,
        sizes: 1,
        collectionName: '$productDetails.collectionName',
        productImage: '$productDetails.images',
        price: '$productDetails.price',
      },
    },

    {
      $sort: {
        totalQuantitySold: -1,
      },
    },

    {
      $limit: 5,
    },
  ]);

  res.status(200).json({
    data,
  });
});

// ======================================================
// STANDARD ORDER CONTROLLERS
// ======================================================

export const getMyOrders = getMine(Order);

export const getOrder = getOne(Order);

export const getAllOrders = getAll(Order);

export const updateOrder = updateOne(Order);

export const deleteOrder = deleteOne(Order);

// ======================================================
// UPLOAD BANK TRANSFER RECEIPT
// ======================================================
//
// This runs BEFORE the order is created.
//
// Frontend:
// POST /api/order/bank-transfer/receipt
//
// FormData:
// image = receipt image
//
// cloudUpload() places the Cloudinary URL in:
// req.body.images
//
// ======================================================

export const uploadBankTransferReceipt = catchAsync(
  async (req: Request, res: Response) => {
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
// SUBMIT BANK TRANSFER RECEIPT
// ======================================================
//
// This endpoint receives the uploaded receipt URL.
//
// Frontend:
// PATCH /api/order/bank-transfer/:orderReference
//
// Body:
// {
//   receiptUrl: "..."
// }
//
// ======================================================

export const submitBankTransferReceipt = catchAsync(
  async (req: Request, res: Response) => {
    const { orderReference } = req.params;

    const receiptUrl = req.body.receiptUrl || req.body.url || req.body.imageUrl;

    // ----------------------------------------------------
    // VALIDATE RECEIPT URL
    // ----------------------------------------------------

    if (!receiptUrl) {
      res.status(400).json({
        status: 'fail',
        message: 'Payment receipt URL is required.',
      });

      return;
    }

    // ----------------------------------------------------
    // FIND ORDER
    // ----------------------------------------------------

    const order = await Order.findOne({
      $or: [
        {
          'paymentInfo.reference': orderReference,
        },
        {
          bankTransferReference: orderReference,
        },
      ],
    });

    // ----------------------------------------------------
    // ORDER NOT FOUND
    // ----------------------------------------------------

    if (!order) {
      res.status(404).json({
        status: 'fail',
        message: 'Order not found. Please check your order reference.',
      });

      return;
    }

    // ----------------------------------------------------
    // SAVE RECEIPT
    // ----------------------------------------------------

    order.bankTransferReceipt = receiptUrl;

    // Keep payment/order pending until admin verifies it.
    order.bankTransferStatus = 'Pending';

    order.paymentInfo.status = 'pending';

    await order.save();

    // ----------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------

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

      order: {
        id: String(order._id),
        orderReference: order.paymentInfo.reference,
        bankTransferReference: order.bankTransferReference,
        bankTransferStatus: order.bankTransferStatus,
      },
    });
  },
);

// ======================================================
// CREATE BANK TRANSFER ORDER
// ======================================================
//
// This endpoint should ONLY be called after the customer
// has filled in their shipping information and uploaded
// their bank transfer receipt.
//
// Frontend:
// POST /api/order/bank-transfer
//
// Body:
// {
//   cart,
//   shippingInfo,
//   bankTransferReceipt,
//   bankTransferReference
// }
//
// ======================================================

export const createBankTransferOrder = catchAsync(
  async (req: Request, res: Response) => {
    const { cart, shippingInfo, bankTransferReceipt, bankTransferReference } =
      req.body as {
        cart: CartItem[];

        shippingInfo: {
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
          address: string;
          city: string;
          state: string;
          postCode?: string | number;
          country?: string;
          countryCode?: string;
          shippingFee?: number;
          shippingMethod?: string;
          additionalInfo?: string;
        };

        bankTransferReceipt?: string;
        bankTransferReference?: string;
      };

    // ==================================================
    // VALIDATE CART
    // ==================================================

    if (!Array.isArray(cart) || cart.length === 0) {
      res.status(400).json({
        status: 'fail',
        message: 'Your cart is empty.',
      });

      return;
    }

    // ==================================================
    // VALIDATE SHIPPING INFORMATION
    // ==================================================

    if (!shippingInfo) {
      res.status(400).json({
        status: 'fail',
        message: 'Shipping information is required.',
      });

      return;
    }

    // ==================================================
    // VALIDATE REQUIRED SHIPPING FIELDS
    // ==================================================

    const requiredShippingFields = [
      shippingInfo.firstName,
      shippingInfo.lastName,
      shippingInfo.email,
      shippingInfo.phoneNumber,
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.state,
    ];

    const missingShippingInformation = requiredShippingFields.some(
      (value) => !value || String(value).trim() === '',
    );

    if (missingShippingInformation) {
      res.status(400).json({
        status: 'fail',
        message: 'Please provide all required shipping information.',
      });

      return;
    }

    // ==================================================
    // VALIDATE RECEIPT
    // ==================================================

    if (!bankTransferReceipt) {
      res.status(400).json({
        status: 'fail',
        message: 'Please upload your bank transfer receipt.',
      });

      return;
    }

    // ==================================================
    // BUILD ORDER ITEMS
    // ==================================================

    const orderItems: Array<{
      productName: string;
      price: number;
      image: string;
      productID: unknown;
      sizes: Array<{
        size: string;
        quantity: number;
      }>;
    }> = [];

    let calculatedSubtotal = 0;
    let calculatedTotalItems = 0;

    // ==================================================
    // PROCESS CART
    // ==================================================

    for (const item of cart) {
      const product = await Product.findById(item.productID);

      // ------------------------------------------------
      // PRODUCT NOT FOUND
      // ------------------------------------------------

      if (!product) {
        res.status(400).json({
          status: 'fail',
          message: `Product not found: ${item.productName}`,
        });

        return;
      }

      // ------------------------------------------------
      // QUANTITY
      // ------------------------------------------------

      const quantity = Math.max(1, Number(item.amount) || 1);

      // ------------------------------------------------
      // ALWAYS USE DATABASE PRICE
      // ------------------------------------------------

      const price = Number(product.price);

      // ------------------------------------------------
      // CALCULATE TOTALS
      // ------------------------------------------------

      calculatedSubtotal += price * quantity;

      calculatedTotalItems += quantity;

      // ------------------------------------------------
      // OPTIONAL SIZE
      // ------------------------------------------------

      const itemWithOptionalSize = item as CartItem & {
        size?: string;
      };

      const size = itemWithOptionalSize.size || '';

      // ------------------------------------------------
      // ADD ORDER ITEM
      // ------------------------------------------------

      orderItems.push({
        productName: product.productName,

        price,

        image: product.images?.[0] || '',

        productID: product._id,

        sizes: [
          {
            size,
            quantity,
          },
        ],
      });
    }

    // ==================================================
    // CALCULATE TOTAL
    // ==================================================

    const shippingFee = Math.max(0, Number(shippingInfo.shippingFee || 0));

    const finalSubtotal = Number(calculatedSubtotal.toFixed(2));

    const finalTotal = Number((finalSubtotal + shippingFee).toFixed(2));

    // ==================================================
    // GENERATE UNIQUE ORDER REFERENCE
    // ==================================================

    const generatedBankReference = `BANK-${Date.now()}-${crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()}`;

    // ==================================================
    // CUSTOMER TRANSFER REFERENCE
    // ==================================================

    const customerTransferReference = (bankTransferReference || '').trim();

    // ==================================================
    // CREATE ORDER
    // ==================================================

    const order = await Order.create({
      // ------------------------------------------------
      // SHIPPING INFORMATION
      // ------------------------------------------------

      shippingInfo: {
        firstName: shippingInfo.firstName.trim(),

        lastName: shippingInfo.lastName.trim(),

        email: shippingInfo.email.trim().toLowerCase(),

        phoneNumber: shippingInfo.phoneNumber.trim(),

        address: shippingInfo.address.trim(),

        city: shippingInfo.city.trim(),

        state: shippingInfo.state.trim(),

        postCode: shippingInfo.postCode
          ? String(shippingInfo.postCode).trim()
          : '',

        country: shippingInfo.country || 'Nigeria',

        countryCode: shippingInfo.countryCode || 'NG',

        shippingFee,

        shippingMethod: shippingInfo.shippingMethod || 'Bank Transfer',
      },

      // ------------------------------------------------
      // ADDITIONAL INFORMATION
      // ------------------------------------------------

      additionalInfo: shippingInfo.additionalInfo?.trim() || '',

      // ------------------------------------------------
      // ORDER ITEMS
      // ------------------------------------------------

      orderItems,

      // ------------------------------------------------
      // PAYMENT INFORMATION
      // ------------------------------------------------

      paymentInfo: {
        reference: generatedBankReference,

        gateway: 'bank_transfer',

        channel: 'bank_transfer',

        status: 'pending',
      },

      // ------------------------------------------------
      // BANK TRANSFER INFORMATION
      // ------------------------------------------------

      bankTransferReceipt,

      bankTransferReference:
        customerTransferReference || generatedBankReference,

      bankTransferStatus: 'Pending',

      bankTransferDate: new Date(),

      // ------------------------------------------------
      // PAYMENT DATE
      // ------------------------------------------------

      paidAt: undefined,

      // ------------------------------------------------
      // TAX
      // ------------------------------------------------

      taxPrice: 0,

      // ------------------------------------------------
      // TOTALS
      // ------------------------------------------------

      total_items: calculatedTotalItems,

      subtotal: finalSubtotal,

      total_amount: finalTotal,

      // ------------------------------------------------
      // ORDER STATUS
      // ------------------------------------------------

      orderStatus: 'pending',
    });

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(201).json({
      status: 'success',

      success: true,

      message:
        'Your bank transfer order has been submitted successfully. Your payment will remain pending until it is verified.',

      order: {
        id: String(order._id),

        orderReference: generatedBankReference,

        bankTransferReference: order.bankTransferReference,

        bankTransferStatus: order.bankTransferStatus,

        subtotal: finalSubtotal,

        shippingFee,

        totalAmount: finalTotal,

        totalItems: calculatedTotalItems,

        email: shippingInfo.email,
      },
    });
  },
);

// ======================================================
// ADMIN VERIFY BANK TRANSFER PAYMENT
// ======================================================
//
// PATCH /api/order/bank-transfer/:orderId/verify
//
// After verification:
// 1. Bank transfer becomes Verified
// 2. Payment status becomes paid
// 3. paidAt is recorded
// 4. Order remains pending for fulfillment
// 5. Customer receives the SAME ORDER RECEIPT EMAIL
//    used by Stripe payments.
//
// ======================================================

export const verifyBankTransferOrder = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // ====================================================
    // FIND ORDER
    // ====================================================

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        status: 'fail',
        message: 'Order not found.',
      });

      return;
    }

    // ====================================================
    // CHECK PAYMENT METHOD
    // ====================================================

    if (order.paymentInfo?.gateway !== 'bank_transfer') {
      res.status(400).json({
        status: 'fail',
        message: 'This order is not a bank transfer order.',
      });

      return;
    }

    // ====================================================
    // PREVENT DOUBLE VERIFICATION
    // ====================================================

    if (order.bankTransferStatus === 'Verified') {
      res.status(400).json({
        status: 'fail',
        message: 'This bank transfer has already been verified.',
      });

      return;
    }

    // ====================================================
    // VERIFY PAYMENT
    // ====================================================

    order.bankTransferStatus = 'Verified';

    order.bankTransferVerifiedAt = new Date();

    order.bankTransferVerifiedBy =
      (
        req as Request & {
          user?: {
            email?: string;
            id?: string;
          };
        }
      ).user?.email ||
      (
        req as Request & {
          user?: {
            email?: string;
            id?: string;
          };
        }
      ).user?.id ||
      'Admin';

    order.paymentInfo.status = 'paid';

    order.paidAt = new Date();

    // ====================================================
    // ORDER STATUS
    // ====================================================
    //
    // Payment is confirmed.
    // The order has not necessarily shipped yet.
    //
    // ====================================================

    order.orderStatus = 'pending';

    await order.save();

    // ====================================================
    // SEND THE SAME ORDER RECEIPT EMAIL USED BY STRIPE
    // ====================================================

    try {
      const customerName =
        `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.trim();

      await sendOrderReceiptEmail({
        email: order.shippingInfo.email,

        fullName: customerName,

        orderId: String(order._id),

        paymentReference: order.paymentInfo.reference,

        orderItems: order.orderItems.map((item) => ({
          productName: item.productName,

          price: Number(item.price) || 0,

          quantity:
            item.sizes?.reduce(
              (total, size) => total + Number(size.quantity || 0),
              0,
            ) || 1,
        })),

        totalAmount: Number(order.total_amount) || 0,
      });

      console.log(
        `📧 Bank transfer order receipt sent to ${order.shippingInfo.email}`,
      );
    } catch (emailError) {
      // ==================================================
      // IMPORTANT
      // ==================================================
      //
      // Payment verification remains successful even if
      // the email fails.
      //
      // ==================================================

      console.error(
        '❌ Bank transfer verified, but order receipt email failed:',
        emailError,
      );
    }

    // ====================================================
    // RESPONSE
    // ====================================================

    res.status(200).json({
      status: 'success',
      success: true,

      message:
        'Bank transfer payment verified successfully and order receipt sent to customer.',

      order: {
        id: String(order._id),

        orderReference: order.paymentInfo.reference,

        bankTransferStatus: order.bankTransferStatus,

        paymentStatus: order.paymentInfo.status,

        paidAt: order.paidAt,

        orderStatus: order.orderStatus,
      },
    });
  },
);
