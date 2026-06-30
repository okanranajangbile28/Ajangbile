import { Model, model, models, Query, Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    priceID: { type: String, required: true },
    totalQuantity: { type: Number, required: true },
    unit: { type: String },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    category: {
      type: String,
      required: true,
    },
    images: [{ type: String, required: true }],
    featured: { type: Boolean, default: false },
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

productSchema.pre<Query<any, IProduct>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// productSchema.virtual('totalQuantity').get(function () {
//   return [...this.sizes].reduce((total, size) => total + size.quantity, 0);
// });

const Product: Model<IProduct> =
  models.Product || model<IProduct>('Product', productSchema);

export default Product;
