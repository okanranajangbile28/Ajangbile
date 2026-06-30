import Blog from '../models/blogModel';
import catchAsync from '../utils/catchAsync';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory';

export const createBlog = catchAsync(async (req, res) => {
  const { title, author, images, summary, content, featured, keywords } =
    req.body;

  // const sanitizedContent = purify.sanitize(content);
  const newBlog = await Blog.create({
    title,
    author,
    thumbnail: images[0],
    summary,
    content,
    featured,
    keywords,
  });

  res.status(201).json({ data: newBlog });
});

export const getAllBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find().select('-updatedAt');

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: blogs,
  });
});
// export const getAllBlogs = getAll(Blog);
export const getBlog = getOne(Blog);

export const updateBlog = updateOne(Blog);
export const deleteBlog = deleteOne(Blog);
