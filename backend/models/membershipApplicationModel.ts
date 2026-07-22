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
    | 'Pending'
    | 'Interview Scheduled'
    | 'Initiation Scheduled'
    | 'Accepted'
    | 'Paid'
    | 'Rejected'
    | 'Completed';

  adminNotes?: string;

  // Initiation Package
  initiationPackage?: 'Basic' | 'Standard' | 'Premium';

  // Payment
  paymentStatus?: 'Pending' | 'Paid';

  paymentAmount?: number;

  paymentReference?: string;

  paymentDate?: Date;

  // Initiation Details
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

    status: {
      type: String,
      enum: [
        'Pending',
        'Interview Scheduled',
        'Initiation Scheduled',
        'Accepted',
        'Paid',
        'Rejected',
        'Completed',
      ],
      default: 'Pending',
    },

    adminNotes: {
      type: String,
      default: '',
      trim: true,
    },
    // ======================
    // Initiation Package
    // ======================

    initiationPackage: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium'],
      default: null,
    },

    // ======================
    // Payment Information
    // ======================

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
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
    // ======================
    // Initiation Information
    // ======================

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
