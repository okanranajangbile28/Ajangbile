import Stripe from 'stripe';
import Product from '../models/productsModel';
import Order from '../models/orderModel';
import catchAsync from '../utils/catchAsync';
import { CartItem } from '../types';
import { sendOrderReceiptEmail } from '../utils/sendEmail';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ======================================================
// CREATE STRIPE CHECKOUT SESSION
// ======================================================

export const getCheckoutSession = catchAsync(async (req, res) => {
  if (!stripe) {
    res.status(500).json({
      status: 'error',
      message: 'Stripe is not configured.',
    });
    return;
  }

  const orderItems: CartItem[] = req.body.orderItems || [];

  if (!orderItems.length) {
    res.status(400).json({
      status: 'fail',
      message: 'Your cart is empty.',
    });
    return;
  }

  // ====================================================
  // BUILD STRIPE LINE ITEMS
  // ====================================================

  const lineItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.productID);

      if (!product) {
        return null;
      }

      return {
        price_data: {
          currency: 'usd',

          product_data: {
            name: product.productName,
            images: product.images?.slice(0, 8),

            // Store MongoDB product ID inside Stripe.
            metadata: {
              productID: String(product._id),
            },
          },

          unit_amount: Math.round(product.price * 100),
        },

        quantity: Math.max(1, Number(item.amount)),
      };
    }),
  );

  const validLineItems = lineItems.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  if (!validLineItems.length) {
    res.status(400).json({
      status: 'fail',
      message: 'No valid products were found.',
    });
    return;
  }

  // ====================================================
  // CREATE STRIPE CHECKOUT SESSION
  // ====================================================

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    mode: 'payment',

    line_items: validLineItems,

    billing_address_collection: 'required',

    phone_number_collection: {
      enabled: true,
    },

    shipping_address_collection: {
      allowed_countries: [
        'AC',
        'AD',
        'AE',
        'AF',
        'AG',
        'AI',
        'AL',
        'AM',
        'AO',
        'AQ',
        'AR',
        'AT',
        'AU',
        'AW',
        'AX',
        'AZ',
        'BA',
        'BB',
        'BD',
        'BE',
        'BF',
        'BG',
        'BH',
        'BI',
        'BJ',
        'BL',
        'BM',
        'BN',
        'BO',
        'BQ',
        'BR',
        'BS',
        'BT',
        'BV',
        'BW',
        'BY',
        'BZ',
        'CA',
        'CD',
        'CF',
        'CG',
        'CH',
        'CI',
        'CK',
        'CL',
        'CM',
        'CN',
        'CO',
        'CR',
        'CV',
        'CW',
        'CY',
        'CZ',
        'DE',
        'DJ',
        'DK',
        'DM',
        'DO',
        'DZ',
        'EC',
        'EE',
        'EG',
        'EH',
        'ER',
        'ES',
        'ET',
        'FI',
        'FJ',
        'FK',
        'FO',
        'FR',
        'GA',
        'GB',
        'GD',
        'GE',
        'GF',
        'GG',
        'GH',
        'GI',
        'GL',
        'GM',
        'GN',
        'GP',
        'GQ',
        'GR',
        'GS',
        'GT',
        'GW',
        'GY',
        'HK',
        'HN',
        'HR',
        'HT',
        'HU',
        'ID',
        'IE',
        'IL',
        'IM',
        'IN',
        'IO',
        'IS',
        'IT',
        'JE',
        'JM',
        'JO',
        'JP',
        'KE',
        'KG',
        'KH',
        'KI',
        'KM',
        'KN',
        'KR',
        'KW',
        'KY',
        'KZ',
        'LA',
        'LB',
        'LC',
        'LI',
        'LK',
        'LR',
        'LS',
        'LT',
        'LU',
        'LV',
        'LY',
        'MA',
        'MC',
        'MD',
        'ME',
        'MG',
        'MK',
        'ML',
        'MM',
        'MN',
        'MO',
        'MQ',
        'MR',
        'MS',
        'MT',
        'MU',
        'MV',
        'MW',
        'MX',
        'MY',
        'MZ',
        'NA',
        'NC',
        'NE',
        'NG',
        'NI',
        'NL',
        'NO',
        'NP',
        'NR',
        'NU',
        'NZ',
        'OM',
        'PA',
        'PE',
        'PF',
        'PG',
        'PH',
        'PK',
        'PL',
        'PM',
        'PN',
        'PR',
        'PS',
        'PT',
        'PY',
        'QA',
        'RE',
        'RO',
        'RS',
        'RW',
        'SA',
        'SB',
        'SC',
        'SE',
        'SG',
        'SH',
        'SI',
        'SJ',
        'SK',
        'SL',
        'SM',
        'SN',
        'SO',
        'SR',
        'ST',
        'SV',
        'SX',
        'SZ',
        'TC',
        'TD',
        'TF',
        'TG',
        'TH',
        'TJ',
        'TK',
        'TL',
        'TM',
        'TN',
        'TO',
        'TR',
        'TT',
        'TV',
        'TW',
        'TZ',
        'UA',
        'UG',
        'US',
        'UY',
        'UZ',
        'VA',
        'VC',
        'VE',
        'VG',
        'VN',
        'VU',
        'WF',
        'WS',
        'YE',
        'YT',
        'ZA',
        'ZM',
        'ZW',
      ],
    },

    success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.status(200).json({
    status: 'success',
    session: session.url,
  });
});

// ======================================================
// STRIPE WEBHOOK
// ======================================================

export const webhookCheckout = async (req: any, res: any) => {
  if (!stripe) {
    return res.status(500).json({
      status: 'error',
      message: 'Stripe is not configured.',
    });
  }

  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing Stripe signature.',
    });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is missing.');

    return res.status(500).json({
      status: 'error',
      message: 'Stripe webhook secret is not configured.',
    });
  }

  // ====================================================
  // VERIFY STRIPE WEBHOOK
  // ====================================================

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error('❌ Stripe webhook signature verification failed.');
    console.error(error);

    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Stripe webhook signature.',
    });
  }

  console.log(`🔔 Stripe event received: ${event.type}`);

  // ====================================================
  // SUCCESSFUL CHECKOUT
  // ====================================================

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('💳 Stripe checkout completed:', session.id);

    // ==================================================
    // PREVENT DUPLICATE ORDERS
    // ==================================================

    const existingOrder = await Order.findOne({
      'paymentInfo.reference': session.id,
    });

    if (existingOrder) {
      console.log('⚠️ Order already exists:', session.id);

      return res.status(200).json({
        status: 'success',
        message: 'Order already recorded.',
      });
    }

    // ==================================================
    // GET STRIPE LINE ITEMS
    // ==================================================

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    const orderItems: Array<{
      productName: string;
      price: number;
      image: string;
      productID: unknown;
      sizes: never[];
    }> = [];

    // ==================================================
    // BUILD ORDER ITEMS FROM DATABASE PRODUCTS
    // ==================================================

    for (const item of lineItems.data) {
      if (!item.price || !item.price.product) {
        continue;
      }

      const stripeProduct = item.price.product;

      // Stripe may return the product as an ID string.
      if (typeof stripeProduct === 'string') {
        continue;
      }

      // Stripe can return DeletedProduct.
      if ('deleted' in stripeProduct && stripeProduct.deleted) {
        continue;
      }

      // At this point Stripe's product is a normal Product.
      const product = stripeProduct as Stripe.Product;

      const productID = product.metadata?.productID;

      if (!productID) {
        console.error(
          '❌ Stripe product does not contain MongoDB productID:',
          product.id,
        );

        continue;
      }

      // =================================================
      // FIND PRODUCT IN MONGODB
      // =================================================

      const databaseProduct = await Product.findById(productID);

      if (!databaseProduct) {
        console.error('❌ MongoDB product not found:', productID);

        continue;
      }

      // =================================================
      // ADD PRODUCT TO ORDER
      // =================================================

      orderItems.push({
        productName: databaseProduct.productName,

        price: databaseProduct.price,

        image: databaseProduct.images?.[0] || '',

        productID: databaseProduct._id,

        sizes: [],
      });
    }

    // ====================================================
    // MAKE SURE PRODUCTS WERE FOUND
    // ====================================================

    if (!orderItems.length) {
      console.error('❌ No valid products found for Stripe order.');

      return res.status(400).json({
        status: 'fail',
        message: 'No valid products found.',
      });
    }

    // ====================================================
    // CUSTOMER INFORMATION
    // ====================================================

    const customer = session.customer_details;

    const shipping = session.shipping_details;

    const address = shipping?.address || customer?.address || null;

    const customerName = shipping?.name || customer?.name || 'Stripe Customer';

    const nameParts = customerName.trim().split(/\s+/);

    const firstName = nameParts.shift() || 'Customer';

    const lastName = nameParts.join(' ') || 'Customer';

    const email = customer?.email || 'unknown@example.com';

    // Stripe normally provides the phone because
    // phone_number_collection is enabled.
    //
    // The fallback is intentionally a valid generic
    // Nigerian-format number so the order model will
    // never reject the order simply because Stripe
    // did not provide a phone number.
    const phone = customer?.phone || '+2340000000000';

    const city = address?.city || 'Unknown';

    const state = address?.state || 'Unknown';

    const country = address?.country || 'NG';

    const postalCode = address?.postal_code || '';

    // ====================================================
    // TOTALS
    // ====================================================

    const totalAmount = (session.amount_total || 0) / 100;

    const subtotal =
      (session.amount_subtotal || session.amount_total || 0) / 100;

    const totalItems = lineItems.data.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );

    // ====================================================
    // CREATE ORDER IN MONGODB
    // ====================================================

    try {
      const order = await Order.create({
        shippingInfo: {
          firstName,

          lastName,

          email,

          phoneNumber: phone,

          address: address?.line1 || 'Stripe Checkout',

          city,

          state,

          postCode: postalCode,

          country,

          countryCode: country,

          shippingFee: 0,

          shippingMethod: 'Stripe Checkout',
        },

        orderItems,

        paymentInfo: {
          reference: session.id,

          gateway: 'stripe',

          channel: 'card',

          status: 'paid',
        },

        paidAt: new Date(),

        taxPrice: 0,

        total_items: totalItems,

        subtotal,

        total_amount: totalAmount,

        orderStatus: 'pending',
      });

      // ==================================================
      // SEND ORDER RECEIPT EMAIL
      // ==================================================

      try {
        await sendOrderReceiptEmail({
          email,
          fullName: customerName,
          orderId: String(order._id),
          stripeReference: session.id,

          orderItems: lineItems.data
            .filter((item) => item.description)
            .map((item) => ({
              productName: item.description || 'Product',

              price:
                (item.amount_total || 0) /
                Math.max(1, Number(item.quantity || 1)) /
                100,

              quantity: Number(item.quantity || 1),
            })),

          totalAmount,
        });
      } catch (emailError) {
        // Do not fail the already successful payment/order
        // if the receipt email has a temporary problem.
        console.error('❌ Order was saved, but receipt email failed:');
        console.error(emailError);
      }

      console.log('======================================');

      console.log('✅ STRIPE ORDER SAVED');

      console.log(`Order ID: ${order._id}`);

      console.log(`Stripe ID: ${session.id}`);

      console.log(`Amount: ${totalAmount}`);

      console.log(`Customer: ${email}`);

      console.log('======================================');
    } catch (error) {
      console.error('❌ Failed to save Stripe order:');

      console.error(error);

      return res.status(500).json({
        status: 'error',
        message: 'Payment received but order could not be saved.',
      });
    }
  }

  // ====================================================
  // PAYMENT FAILED
  // ====================================================

  if (event.type === 'payment_intent.payment_failed') {
    console.log('❌ Stripe payment failed.');
  }

  // ====================================================
  // RESPONSE TO STRIPE
  // ====================================================

  return res.status(200).json({
    status: 'success',
    received: true,
  });
};

// ======================================================
// EXISTING PLACEHOLDER FUNCTIONS
// ======================================================

export const stripeProduct = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Stripe product creation placeholder',
  });
});

export const shippingRate = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Stripe shipping rate placeholder',
  });
});

export const listShipping = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Stripe shipping list placeholder',
  });
});
