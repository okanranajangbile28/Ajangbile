import { Model, model, models, Query, Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
    },

    priceID: {
      type: String,
      required: [true, 'Price ID is required'],
      unique: true,
    },

    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      default: 0,
    },

    unit: {
      type: String,
      default: 'piece',
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    images: {
      type: [String],
      required: [true, 'At least one image is required'],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// Hide inactive products
productSchema.pre<Query<any, IProduct>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Product: Model<IProduct> =
  models.Product || model<IProduct>('Product', productSchema);

export default Product;
