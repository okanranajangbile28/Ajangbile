import { Model, Query, Schema, model, models } from 'mongoose';
import { IOrder } from '../types';

const orderSchema = new Schema<IOrder>({
  shippingInfo: {
    firstName: { type: String, required: [true, 'first name is required'] },
    lastName: { type: String, required: [true, 'last name is required'] },
    email: { type: String, required: [true, 'email is required'] },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^(?:\+234\d{10}|0\d{10})$/.test(v.replace(/\s/g, ''));
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid phone number!`,
      },
    },
    address: {
      type: String,
      required: [true, 'shipping address is required'],
    },
    city: {
      type: String,
      required: [true, 'city is required'],
    },
    state: { type: String, required: [true, 'please enter a state'] },
    postCode: {
      type: Number,
      // required: [true, 'please enter a postal Code'],
    },
    country: {
      type: String,
      // required: [true, 'please enter a shipping address'],
      default: 'Nigeria',
    },
    countryCode: {
      type: String,
      // required: [true, 'country code is required'],
      default: 'NG',
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingMethod: {
      type: String,
      // required: true,
    },
  },
  additionalInfo: { type: String },
  orderItems: [
    {
      productName: {
        type: String,
        required: [true, 'Order must have a name'],
      },
      price: {
        type: Number,
        require: [true, 'Booking must have a price.'],
      },
      image: {
        type: String,
        required: [true, 'order must have a image'],
      },

      productID: {
        type: Schema.ObjectId,
        required: [true, 'order must have a product'],
        ref: 'Product',
      },
    },
  ],
  paymentInfo: {
    reference: {
      type: String,
      required: [true, 'order must have a payment reference'],
      unique: [true, 'two orders cant have the same reference'],
    },
    gateway: {
      type: String,
      required: [true, 'payment should have a gateway'],
    },
    channel: { type: String },
    status: {
      type: String,
    },
  },

  paidAt: {
    type: Date,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },

  total_items: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
    // default: 0.0,
  },
  total_amount: {
    type: Number,
    required: true,
    // default: 0.0,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'shipped', 'completed', 'failed'],
    default: 'pending',
  },
  deliveredAt: {
    type: Date,
  },
});

// orderSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//     select: 'firstname lastname phoneNumber email ',
//   });
//   next();
// });

// orderSchema.pre<Query<any, IOrder>>(/^find/, function (next) {
//   this.populate({
//     path: 'orderItems.productID',
//     select: 'collectionName sizes',
//   });
//   next();
// });

const Order: Model<IOrder> = models.Order || model('Order', orderSchema);

export default Order;
