import paypal from '@paypal/checkout-server-sdk';
import Product from '../models/productsModel';
import catchAsync from '../utils/catchAsync';
import { Request, Response } from 'express';
import AppError from '../utils/appError';
import { arrangeCart } from './paystackCheckout';
import { PaypalCartType } from '../types';

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
const environment = new paypal.core.SandboxEnvironment(
  PAYPAL_CLIENT_ID as string,
  PAYPAL_APP_SECRET as string,
);
const client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders

// Call API with your client and get a response for your call
export const createOrder = catchAsync(async (req, res, next) => {
  let amount = 0;
  let itemTotal = 0;

  const arrangedCart = arrangeCart(req.body.orderItems);

  const cart = await Promise.all(
    arrangedCart.map(async (item) => {
      const product = await Product.findById(item.productID);
      if (product) {
        itemTotal += product.price * item.totalQuantity;

        return {
          name: product.productName,
          unit_amount: { currency_code: 'USD', value: String(product.price) },
          description: product.description,
          quantity: String(item.totalQuantity),
          category: 'PHYSICAL_GOODS' as 'PHYSICAL_GOODS',
        };
      } else {
        next(new AppError('Cannot find product with such ID', 500));
      }
    }),
  );
  amount = itemTotal + req.body.shippingInfo.shippingFee;

  const filteredCart: PaypalCartType[] = cart.filter(
    (item: PaypalCartType | undefined): item is PaypalCartType =>
      item !== undefined,
  );

  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: String(amount),

          breakdown: {
            shipping: {
              currency_code: 'USD',
              value: req.body.shippingInfo.shippingFee,
            },
            discount: {
              currency_code: 'USD',
              value: '0',
            },
            handling: {
              currency_code: 'USD',
              value: '0',
            },
            insurance: {
              currency_code: 'USD',
              value: '0',
            },
            shipping_discount: {
              currency_code: 'USD',
              value: '0',
            },

            tax_total: {
              currency_code: 'USD',
              value: '0',
            },
            item_total: { currency_code: 'USD', value: String(itemTotal) },
          },
        },
        items: filteredCart,
        description: req.body.description,
        shipping: {
          address: {
            country_code: req.body.shippingInfo.countryCode,
            address_line_1: req.body.shippingInfo.address,
            admin_area_2: req.body.shippingInfo.city,
            postal_code: req.body.shippingInfo.postalCode,
          },
          name: {
            full_name: `${req.body.shippingInfo.firstName} ${req.body.shippingInfo.lastName}`,
          },
          type: req.body.shippingInfo.type,
        },
      },
    ],
  });

  const response = await client.execute(request);
  // console.log(`Response: ${JSON.stringify(response)}`);

  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  // console.log(`Order: ${JSON.stringify(response.result)}`);

  res.status(201).json({
    response: response.result,
  });
});

export const captureOrder = async function (req: Request, res: Response) {
  const { orderID } = req.params;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({
    payment_source: { token: { id: 'BAZ', type: 'BILLING_AGREEMENT' } },
  });
  // Call API with your client and get a response for your call
  const response = await client.execute(request);
  // console.log(`Response: ${JSON.stringify(response)}`);
  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  // console.log(`Capture: ${JSON.stringify(response.result)}`);

  res.status(201).json({
    response,
  });
};
