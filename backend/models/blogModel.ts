import { Model, model, models, Schema } from 'mongoose';
import { IBlog } from '../types';
import { Query } from 'mongoose';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    summary: { type: String, required: true },
    thumbnail: { type: String, required: true },
    content: { type: String, required: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    keywords: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

blogSchema.pre<Query<any, IBlog>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
const Blog: Model<IBlog> = models.Blog || model<IBlog>('Blog', blogSchema);

export default Blog;
