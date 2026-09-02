import mongoose, { Document, Schema } from 'mongoose';

export interface IPricing extends Document {
  applicationFee: number;

  basicInitiation: number;
  standardInitiation: number;
  premiumInitiation: number;

  opeleConsultation: number;
  ikinConsultation: number;
  oneHourConsultation: number;

  currency: 'USD';

  createdAt: Date;
  updatedAt: Date;
}

const pricingSchema = new Schema<IPricing>(
  {
    applicationFee: {
      type: Number,
      required: true,
      default: 12,
    },

    basicInitiation: {
      type: Number,
      required: true,
      default: 224,
    },

    standardInitiation: {
      type: Number,
      required: true,
      default: 450,
    },

    premiumInitiation: {
      type: Number,
      required: true,
      default: 750,
    },

    opeleConsultation: {
      type: Number,
      required: true,
      default: 10,
    },

    ikinConsultation: {
      type: Number,
      required: true,
      default: 15,
    },

    oneHourConsultation: {
      type: Number,
      required: true,
      default: 100,
    },

    currency: {
      type: String,
      enum: ['USD'],
      default: 'USD',
    },
  },
  {
    timestamps: true,
  },
);

const Pricing = mongoose.model<IPricing>('Pricing', pricingSchema);

export default Pricing;
