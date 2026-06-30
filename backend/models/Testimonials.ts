import { Model, model, models, Query, Schema } from 'mongoose';
import { ITestimonial } from '../types';

const testimonialSchema = new Schema<ITestimonial>(
  {
    fullName: { type: String, required: true },
    authorImage: { type: String, required: true },
    quote: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Testimonial: Model<ITestimonial> =
  models.Testimonial || model<ITestimonial>('Testimonial', testimonialSchema);

export default Testimonial;
