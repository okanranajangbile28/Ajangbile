import mongoose, { Document, Schema } from 'mongoose';

export interface IMemberSignupRequest extends Document {
  fullname: string;

  username: string;

  email: string;

  password: string;

  passwordConfirm: string;

  phone: string;

  gender: string;

  occupation: string;

  chieftaincyTitle?: string;

  state: string;

  localGovernment: string;

  city: string;

  address: string;

  photo?: string;

  status: 'Pending' | 'Approved' | 'Rejected';

  adminNotes?: string;

  approvedAt?: Date;

  createdUser?: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const memberSignupRequestSchema = new Schema<IMemberSignupRequest>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    passwordConfirm: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
      required: true,
    },

    chieftaincyTitle: {
      type: String,
      default: '',
    },

    state: {
      type: String,
      required: true,
    },

    localGovernment: {
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

    photo: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    adminNotes: {
      type: String,
    },

    approvedAt: {
      type: Date,
    },

    createdUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IMemberSignupRequest>(
  'MemberSignupRequest',
  memberSignupRequestSchema,
);
