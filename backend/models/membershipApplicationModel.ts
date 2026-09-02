import mongoose, { Schema, Document } from 'mongoose';

export interface IMembershipApplication extends Document {
  fullName: string;
  email: string;
  phone: string;

  gender: string;
  dateOfBirth: Date;
  maritalStatus: string;

  country: string;
  state: string;
  city: string;

  address: string;

  occupation: string;

  nextOfKin: string;
  nextOfKinPhone: string;

  reason: string;

  previousInstitution: boolean;
  institutionName?: string;

  referredBy?: string;

  photo: string;
  signature: string;

  declarationAccepted: boolean;
  ndaAccepted: boolean;

  status:
    | 'Payment Pending'
    | 'Pending'
    | 'Interview Scheduled'
    | 'Initiation Scheduled'
    | 'Accepted'
    | 'Paid'
    | 'Rejected'
    | 'Completed';

  adminNotes?: string;

  // ==========================================
  // APPLICATION FEE
  // ==========================================

  applicationFeeStatus?: 'Pending' | 'Paid';

  applicationFeeAmount?: number;

  applicationFeeReference?: string;

  applicationFeeDate?: Date;

  // ==========================================
  // APPLICATION FEE - PAYMENT METHOD
  // ==========================================

  applicationFeePaymentMethod?: 'stripe' | 'bank_transfer';

  // ==========================================
  // APPLICATION FEE - BANK TRANSFER
  // ==========================================

  applicationFeeBankTransferStatus?: 'Pending' | 'Verified' | 'Rejected';

  applicationFeeBankTransferReference?: string;

  applicationFeeBankTransferDate?: Date;

  applicationFeeBankTransferReceipt?: string;

  applicationFeeBankTransferReceiptPublicId?: string;

  // ==========================================
  // INITIATION PACKAGE
  // ==========================================

  initiationPackage?: 'Basic' | 'Standard' | 'Premium';

  // ==========================================
  // INITIATION PAYMENT
  // ==========================================

  paymentStatus?: 'Pending' | 'Paid';

  initiationStatus?: 'Pending' | 'Scheduled' | 'Completed';

  paymentAmount?: number;

  paymentReference?: string;

  paymentDate?: Date;

  // ==========================================
  // INITIATION PAYMENT - PAYMENT METHOD
  // ==========================================

  paymentMethod?: 'stripe' | 'bank_transfer';

  // ==========================================
  // INITIATION PAYMENT - BANK TRANSFER
  // ==========================================

  bankTransferStatus?: 'Pending' | 'Verified' | 'Rejected';

  bankTransferReference?: string;

  bankTransferDate?: Date;

  bankTransferReceipt?: string;

  bankTransferReceiptPublicId?: string;

  // ==========================================
  // INITIATION DETAILS
  // ==========================================

  initiationDate?: Date;

  initiationTime?: string;

  initiationVenue?: string;

  initiationInstructions?: string;

  initiationFee?: number;

  createdAt: Date;
  updatedAt: Date;
}

const membershipApplicationSchema = new Schema<IMembershipApplication>(
  {
    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    maritalStatus: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
      required: true,
    },

    nextOfKin: {
      type: String,
      required: true,
    },

    nextOfKinPhone: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
    },

    previousInstitution: {
      type: Boolean,
      default: false,
    },

    institutionName: {
      type: String,
      default: '',
      trim: true,
    },

    referredBy: {
      type: String,
      default: '',
      trim: true,
    },

    photo: {
      type: String,
      required: true,
    },

    signature: {
      type: String,
      required: true,
    },

    declarationAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    ndaAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    // ==========================================
    // APPLICATION STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        'Payment Pending',
        'Pending',
        'Interview Scheduled',
        'Initiation Scheduled',
        'Accepted',
        'Paid',
        'Rejected',
        'Completed',
      ],
      default: 'Payment Pending',
    },

    adminNotes: {
      type: String,
      default: '',
      trim: true,
    },

    // ==========================================
    // APPLICATION FEE
    // ==========================================

    applicationFeeStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },

    applicationFeeAmount: {
      type: Number,
      default: 0,
    },

    applicationFeeReference: {
      type: String,
      default: '',
      trim: true,
    },

    applicationFeeDate: {
      type: Date,
      default: null,
    },

    // ==========================================
    // APPLICATION FEE - PAYMENT METHOD
    // ==========================================

    applicationFeePaymentMethod: {
      type: String,
      enum: ['stripe', 'bank_transfer'],
      default: undefined,
    },

    // ==========================================
    // APPLICATION FEE - BANK TRANSFER
    // ==========================================

    applicationFeeBankTransferStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: undefined,
    },

    applicationFeeBankTransferReference: {
      type: String,
      default: '',
      trim: true,
    },

    applicationFeeBankTransferDate: {
      type: Date,
      default: null,
    },

    applicationFeeBankTransferReceipt: {
      type: String,
      default: '',
    },

    applicationFeeBankTransferReceiptPublicId: {
      type: String,
      default: '',
    },

    // ==========================================
    // INITIATION PACKAGE
    // ==========================================

    initiationPackage: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium'],
      default: null,
    },

    // ==========================================
    // INITIATION PAYMENT
    // ==========================================

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },

    initiationStatus: {
      type: String,
      enum: ['Pending', 'Scheduled', 'Completed'],
      default: 'Pending',
    },

    paymentAmount: {
      type: Number,
      default: 0,
    },

    paymentReference: {
      type: String,
      default: '',
      trim: true,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    // ==========================================
    // INITIATION PAYMENT - PAYMENT METHOD
    // ==========================================

    paymentMethod: {
      type: String,
      enum: ['stripe', 'bank_transfer'],
      default: undefined,
    },

    // ==========================================
    // INITIATION PAYMENT - BANK TRANSFER
    // ==========================================

    bankTransferStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
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

    // ==========================================
    // INITIATION DETAILS
    // ==========================================

    initiationDate: {
      type: Date,
      default: null,
    },

    initiationTime: {
      type: String,
      default: '',
      trim: true,
    },

    initiationVenue: {
      type: String,
      default: '',
      trim: true,
    },

    initiationInstructions: {
      type: String,
      default: '',
      trim: true,
    },

    initiationFee: {
      type: Number,
      default: 50000,
    },
  },
  {
    timestamps: true,
  },
);

const MembershipApplication = mongoose.model<IMembershipApplication>(
  'MembershipApplication',
  membershipApplicationSchema,
);

export default MembershipApplication;
