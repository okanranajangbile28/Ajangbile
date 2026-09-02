import mongoose, { Document, Schema } from 'mongoose';

// ======================================================
// CONSULTATION DOCUMENT TYPE
// ======================================================

export interface IConsultation extends Document {
  consultationType: 'Opele' | 'Ikin' | 'OneHour';
  consultationName: string;

  customerName?: string;
  email?: string;
  phone?: string;

  amount: number;
  currency: 'USD';

  paymentMethod: 'stripe' | 'bank_transfer';

  paymentStatus: 'pending' | 'paid' | 'failed';

  // ====================================================
  // STRIPE PAYMENT
  // ====================================================

  stripeSessionId?: string;
  stripePaymentIntentId?: string;

  // ====================================================
  // BANK TRANSFER PAYMENT
  // ====================================================

  bankTransferStatus?: 'pending' | 'verified' | 'rejected';

  bankTransferReference?: string;

  bankTransferDate?: Date;

  bankTransferReceipt?: string;

  bankTransferReceiptPublicId?: string;

  createdAt: Date;

  updatedAt: Date;
}

// ======================================================
// CONSULTATION SCHEMA
// ======================================================

const consultationSchema = new Schema<IConsultation>(
  {
    // ==================================================
    // CONSULTATION INFORMATION
    // ==================================================

    consultationType: {
      type: String,
      enum: ['Opele', 'Ikin', 'OneHour'],
      required: true,
    },

    consultationName: {
      type: String,
      required: true,
      trim: true,
    },

    // ==================================================
    // CUSTOMER INFORMATION
    // ==================================================

    customerName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // ==================================================
    // PAYMENT INFORMATION
    // ==================================================

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ['USD'],
      default: 'USD',
    },

    paymentMethod: {
      type: String,
      enum: ['stripe', 'bank_transfer'],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },

    // ==================================================
    // STRIPE PAYMENT
    // ==================================================

    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },

    // ==================================================
    // BANK TRANSFER PAYMENT
    // ==================================================

    bankTransferStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: undefined,
    },

    bankTransferReference: {
      type: String,
      default: '',
      trim: true,
    },

    bankTransferDate: {
      type: Date,
      default: null,
    },

    bankTransferReceipt: {
      type: String,
      default: '',
    },

    bankTransferReceiptPublicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

// ======================================================
// EXPORT MODEL
// ======================================================

const Consultation = mongoose.model<IConsultation>(
  'Consultation',
  consultationSchema,
);

export default Consultation;
