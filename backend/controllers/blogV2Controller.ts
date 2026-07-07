import { Request, Response } from 'express';
import BlogV2 from '../models/BlogV2';

// ================= CREATE BLOG =================

export const createBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blog = await BlogV2.create({
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      category: req.body.category,
      featured: req.body.featured === 'true',
      published: req.body.published === 'true',
      coverImage: req.body.images?.[0] || '',
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL BLOGS =================

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await BlogV2.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ONE =================

export const getBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await BlogV2.findById(req.params.id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    blog.views += 1;

    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE =================

export const updateBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updateData: any = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      category: req.body.category,
      featured: req.body.featured === 'true',
      published: req.body.published === 'true',
    };

    if (req.body.images?.length) {
      updateData.coverImage = req.body.images[0];
    }

    const blog = await BlogV2.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE =================

export const deleteBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await BlogV2.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= FEATURED =================

export const featuredBlogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blogs = await BlogV2.find({
      featured: true,
      published: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= SEARCH =================

export const searchBlogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const keyword = String(req.query.keyword || '');

    const blogs = await BlogV2.find({
      title: {
        $regex: keyword,
        $options: 'i',
      },
      published: true,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
