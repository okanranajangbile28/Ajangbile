import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IOgboniBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;

  category: string;
  tags: string[];

  author: string;

  featured: boolean;
  published: boolean;

  readingTime: number;

  views: number;

  createdAt: Date;
  updatedAt: Date;
}

const OgboniBlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      default: 'Ogboni Tradition',
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: String,
      default: 'Iledi Ajangbile',
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    readingTime: {
      type: Number,
      default: 1,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

OgboniBlogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }

  this.readingTime = Math.max(
    1,
    Math.ceil(this.content.split(/\s+/).length / 200),
  );

  next();
});

export default mongoose.model<IOgboniBlog>('OgboniBlog', OgboniBlogSchema);
