import Paystack from 'paystack';
import crypto from 'crypto';
import Order from '../models/orderModel';
import Product from '../models/productsModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY as string);

import getUniqueValues from '../utils/uniqueValues';
import { sendMail } from '../utils/email';
import emailOrderTemplate from '../utils/templates';
import { CartItem, IBaseObject, IShippingInfo, ISize } from '../types';

export const arrangeCart = (orderItems: CartItem[]): IBaseObject[] => {
  const uniqueID = getUniqueValues(orderItems, 'productID');
  const newOrderItems = uniqueID.map((id) => {
    const itemsWithSameID = orderItems.filter((item) => item.productID === id);

    const baseObject = itemsWithSameID.reduce(
      (acc: IBaseObject, item: CartItem) => {
        acc.productID = id;
        acc.productName = item.productName;
        acc.price = item.price;
        acc.image = item.image;
        acc.sizes.push({
          size: item.size,
          quantity: item.amount,
        });
        acc.totalQuantity += Number(item.amount);
        return acc;
      },
      {
        productName: '',
        price: 0,
        totalQuantity: 0,
        image: '',
        sizes: [],
        productID: '',
      },
    );

    return baseObject;
  });

  return newOrderItems;
};

const composeOrderDetails = ({
  data,
  newOrderItems,
}: {
  data: {
    metadata: {
      shippingInfo: IShippingInfo;
      subtotal: number;
      total_amount: number;
    };
    reference: string;
    created_at: number;
  };
  newOrderItems: IBaseObject[];
}) => {
  let content = '';

  newOrderItems.forEach((item) => {
    content += `<tr><td>${item.productName}</td><td>${Number(
      item.totalQuantity,
    )}</td><td>${item.totalQuantity * item.price}</td></tr>`;
  });

  const replacements: { [key: string]: any } = {
    '%FIRSTNAME%': data.metadata.shippingInfo.firstName,
    '%LASTNAME%': data.metadata.shippingInfo.lastName,
    '%REFERENCE%': data.reference.toUpperCase(),
    '%DATE%': new Date(data.created_at).toLocaleString('en-GB'),
    '%ORDERS%': content,
    '%PHONE%': data.metadata.shippingInfo.phoneNumber,
    '%EMAIL%': data.metadata.shippingInfo.email,
    '%ADDRESS%': data.metadata.shippingInfo.address,
    '%CITY%': data.metadata.shippingInfo.city,
    '%STATE%': data.metadata.shippingInfo.state,
    '%SUBTOTAL%': data.metadata.subtotal,
    '%SHIPPING_FEE%': data.metadata.shippingInfo.shippingFee,
    '%TOTAL%': data.metadata.total_amount,
    '%ADDITIONAL_INFO%': data.metadata.shippingInfo.additionalInfo,
  };
  let updatedTemplate = emailOrderTemplate;

  Object.keys(replacements).forEach((key) => {
    updatedTemplate = updatedTemplate.replace(
      new RegExp(key, 'g'),
      replacements[key],
    );
  });

  return updatedTemplate;
};

const updateStock = async (orderItems: CartItem[]) => {
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      { _id: item.productID, 'sizes.size': item.size },
      { $inc: { 'sizes.$.quantity': -item.amount } },
      { new: true },
    );
  }
};

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber } = req.body.shippingInfo;
  // const helper = new paystack.FeeHelper();

  //1) Initialize the transaction
  const session = await paystack.transaction.initialize({
    name: `${firstName} ${lastName}`,
    reference: '',
    phone: phoneNumber,
    email,
    amount: req.body.total_amount,
    callback_url:
      process.env.NODE_ENV === 'development'
        ? `${process.env.LOCAL_CLIENT_URL}/order`
        : `${process.env.CLIENT_URL}/order`,
    metadata: { ...req.body },
  });

  res.status(200).json({ data: session.data.authorization_url });
});

export const verifyOrder = catchAsync(async (req, res, next) => {
  const verified = await paystack.transaction.verify(req.params.reference);

  const {
    data: {
      paid_at: paidAt,
      created_at: createdAt,
      reference,
      channel,
      status,
      domain,
      metadata: {
        orderItems,
        shippingInfo,
        subtotal,
        total_amount: totalAmount,
        total_items: totalItems,
      },
    },
  } = verified;

  if (status !== 'success')
    next(new AppError('invalid payment reference', 401));
  if (domain === 'live') {
    const newOrderItems = arrangeCart(orderItems);

    const order = await Order.create({
      shippingInfo,
      additionalInfo: shippingInfo.additionalInfo,
      total_amount: totalAmount,
      subtotal,
      total_items: totalItems,
      orderItems: newOrderItems,
      paidAt,
      createdAt,
      paymentInfo: {
        reference: reference,
        channel: channel,
        status: status,
        gateway: 'PAYSTACK',
      },
    });

    if (!order) {
      next(new AppError('Could not create order. Please try again.', 400));
    }
    const updatedTemplate = composeOrderDetails({
      data: verified.data,
      newOrderItems,
    });

    sendMail({
      from: process.env.OFFICIAL_MAIL as string,
      to: shippingInfo.email,
      subject: 'ORDER DETAILS',
      text: JSON.stringify(order),
      html: updatedTemplate,
    });
    updateStock(orderItems);
    res.status(200);
  }
});

export const updatePayStackOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const { status } = req.query;
    const verified = await paystack.transaction.verify(
      order.paymentInfo.reference,
    );

    if (verified.data.status !== 'success')
      next(new AppError('invalid payment reference', 401));

    const { orderStatus, deliveredAt } = req.body;
    req.body = { orderStatus, deliveredAt };

    if (status === 'completed') {
      order.orderStatus = 'completed';
      order.deliveredAt = new Date(Date.now());
    } else {
      order.orderStatus = status as
        | 'pending'
        | 'shipped'
        | 'completed'
        | 'failed';
    }
    order.save();
    res.status(200).json({ status: 'success', order });
  } else {
    next(new AppError('No Order with that ID', 500));
  }
});

export const payStackWebHook = catchAsync(async (req, res, next) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    next(new AppError('invalid signature', 400));
  }
  const { event, data } = req.body;
  const {
    orderItems,
    shippingInfo,
    subtotal,
    total_items: totalItems,
  } = data.metadata;

  if (event === 'charge.success' && data.domain === 'live') {
    const newOrderItems = arrangeCart(orderItems);

    const order = await Order.create({
      shippingInfo,
      additionalInfo: shippingInfo.additionalInfo,
      total_amount: Number(subtotal) + Number(shippingInfo.shippingFee),
      subtotal,
      total_items: totalItems,
      orderItems: newOrderItems,
      paidAt: data.paid_at,
      createdAt: data.created_at,
      paymentInfo: {
        reference: data.reference,
        channel: data.channel,
        status: data.status,
        gateway: 'PAYSTACK',
      },
    });

    if (!order) {
      next(new AppError('Could not create order. Please try again.', 400));
    }
    const updatedTemplate = composeOrderDetails({ data, newOrderItems });

    sendMail({
      from: process.env.OFFICIAL_MAIL as string,
      to: shippingInfo.email,
      subject: 'ORDER DETAILS',
      text: JSON.stringify(order),
      html: updatedTemplate,
    });
    updateStock(orderItems);
    res.status(200);
  } else {
    res.status(200);
  }
});
