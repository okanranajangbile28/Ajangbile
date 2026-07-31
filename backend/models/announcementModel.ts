import mongoose, { Schema } from 'mongoose';

const announcementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      enum: ['Announcement', 'Weekly Update', 'Event'],
      default: 'Announcement',
    },

    active: {
      type: Boolean,
      default: true,
    },

    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Announcement', announcementSchema);
