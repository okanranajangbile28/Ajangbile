import mongoose from 'mongoose';

const ogboniMemberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

    fullName: {
      type: String,
      default: '',
    },

    phoneNumber: {
      type: String,
      default: '',
    },

    gender: {
      type: String,
      default: '',
    },

    dateOfBirth: {
      type: String,
      default: '',
    },

    occupation: {
      type: String,
      default: '',
    },

    chiefTitle: {
      type: String,
      default: 'Not Assigned',
    },

    state: {
      type: String,
      default: '',
    },

    lga: {
      type: String,
      default: '',
    },

    city: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      default: '',
    },

    reason: {
      type: String,
      default: '',
    },

    approved: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // Password Reset
    // ==========================

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('OgboniMember', ogboniMemberSchema);
