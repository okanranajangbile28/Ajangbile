import { Model, Schema, model, models } from 'mongoose';

import { IOrder } from '../types';

const orderSchema = new Schema<IOrder>(
  {
    // ==========================================
    // SHIPPING INFORMATION
    // ==========================================

    shippingInfo: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
      },

      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
      },

      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
      },

      phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,

        validate: {
          validator: function (v: string) {
            const phone = v.replace(/[\s\-().]/g, '');

            // Accept international phone numbers such as:
            // +2348012345678
            // +447911123456
            // +14155552671
            return /^\+?[1-9]\d{7,14}$/.test(phone);
          },

          message: (props: { value: string }) =>
            `${props.value} is not a valid phone number!`,
        },
      },

      address: {
        type: String,
        required: [true, 'Shipping address is required'],
        trim: true,
      },

      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },

      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },

      postCode: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        default: 'Nigeria',
        trim: true,
      },

      countryCode: {
        type: String,
        default: 'NG',
        trim: true,
        uppercase: true,
      },

      shippingFee: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },

      shippingMethod: {
        type: String,
        default: '',
      },
    },

    // ==========================================
    // ADDITIONAL INFORMATION
    // ==========================================

    additionalInfo: {
      type: String,
      default: '',
      trim: true,
    },

    // ==========================================
    // ORDER ITEMS
    // ==========================================

    orderItems: [
      {
        productName: {
          type: String,
          required: [true, 'Order must have a product name'],
        },

        price: {
          type: Number,
          required: [true, 'Order must have a price'],
          min: 0,
        },

        image: {
          type: String,
          required: [true, 'Order must have an image'],
        },

        productID: {
          type: Schema.Types.ObjectId,
          required: [true, 'Order must have a product'],
          ref: 'Product',
        },

        sizes: [
          {
            size: {
              type: String,
              default: '',
            },

            quantity: {
              type: Number,
              required: true,
              min: 1,
            },
          },
        ],
      },
    ],

    // ==========================================
    // PAYMENT INFORMATION
    // ==========================================

    paymentInfo: {
      reference: {
        type: String,
        required: [true, 'Order must have a payment reference'],
        unique: true,
        index: true,
      },

      gateway: {
        type: String,
        required: [true, 'Payment gateway is required'],
        default: 'stripe',
      },

      channel: {
        type: String,
        default: 'card',
      },

      status: {
        type: String,
        default: 'pending',
      },
    },

    // ==========================================
    // BANK TRANSFER PAYMENT
    // ==========================================

    bankTransferReceipt: {
      type: String,
      default: '',
    },

    bankTransferReference: {
      type: String,
      default: '',
      index: true,
    },

    bankTransferStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: undefined,
    },

    bankTransferDate: {
      type: Date,
    },

    bankTransferVerifiedAt: {
      type: Date,
    },

    bankTransferVerifiedBy: {
      type: String,
      default: '',
    },

    // ==========================================
    // PAYMENT DATE
    // ==========================================

    paidAt: {
      type: Date,
    },

    // ==========================================
    // TAX
    // ==========================================

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // ==========================================
    // ORDER TOTALS
    // ==========================================

    total_items: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // ORDER STATUS
    // ==========================================

    orderStatus: {
      type: String,
      required: true,
      enum: ['pending', 'shipped', 'completed', 'failed'],
      default: 'pending',
    },

    // ==========================================
    // DELIVERY
    // ==========================================

    deliveredAt: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
);

// ==========================================
// INDEXES
// ==========================================

orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ 'paymentInfo.gateway': 1 });
orderSchema.index({ bankTransferStatus: 1 });

// ==========================================
// MODEL
// ==========================================

const Order: Model<IOrder> =
  models.Order || model<IOrder>('Order', orderSchema);

export default Order;
