import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OgboniMember',
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

const ilediOgboniPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },

    image: {
      type: String,
      default: '',
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OgboniMember',
      },
    ],

    comments: [commentSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('IlediOgboniPost', ilediOgboniPostSchema);
