import { Request, Response } from 'express';
import slugify from 'slugify';
import OgboniBlog from '../models/OgboniBlog';

// =====================================================
// CREATE OGBONI BLOG
// =====================================================

export const createOgboniBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const readingTime = Math.max(
      1,
      Math.ceil((req.body.content || '').split(/\s+/).length / 200),
    );

    const blog = await OgboniBlog.create({
      title: req.body.title,

      slug: slugify(req.body.title, {
        lower: true,
        strict: true,
      }),

      excerpt: req.body.excerpt,

      content: req.body.content,

      category: req.body.category || 'Ogboni Tradition',

      featured: req.body.featured === 'true',

      published: req.body.published === 'true',

      coverImage: req.body.images?.[0] || '',

      readingTime,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error('❌ Create Ogboni Blog Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL PUBLISHED OGBONI BLOGS
// =====================================================

export const getOgboniBlogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blogs = await OgboniBlog.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error: any) {
    console.error('❌ Get Ogboni Blogs Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET OGBONI BLOG BY SLUG
// =====================================================

export const getOgboniBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blog = await OgboniBlog.findOne({
      slug: req.params.slug,
      published: true,
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Ogboni blog not found',
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
    console.error('❌ Get Ogboni Blog Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET OGBONI BLOG BY ID
// ADMIN
// =====================================================

export const getOgboniBlogById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blog = await OgboniBlog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Ogboni blog not found',
      });

      return;
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error('❌ Get Ogboni Blog By ID Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE OGBONI BLOG
// =====================================================

export const updateOgboniBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updateData: any = {
      title: req.body.title,

      slug: slugify(req.body.title, {
        lower: true,
        strict: true,
      }),

      excerpt: req.body.excerpt,

      content: req.body.content,

      category: req.body.category || 'Ogboni Tradition',

      featured: req.body.featured === 'true',

      published: req.body.published === 'true',

      readingTime: Math.max(
        1,
        Math.ceil((req.body.content || '').split(/\s+/).length / 200),
      ),
    };

    if (req.body.images?.length) {
      updateData.coverImage = req.body.images[0];
    }

    const blog = await OgboniBlog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Ogboni blog not found',
      });

      return;
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error('❌ Update Ogboni Blog Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE OGBONI BLOG
// =====================================================

export const deleteOgboniBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blog = await OgboniBlog.findByIdAndDelete(req.params.id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Ogboni blog not found',
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: 'Ogboni blog deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Delete Ogboni Blog Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// FEATURED OGBONI BLOGS
// =====================================================

export const featuredOgboniBlogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blogs = await OgboniBlog.find({
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
    console.error('❌ Featured Ogboni Blogs Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// SEARCH OGBONI BLOGS
// =====================================================

export const searchOgboniBlogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const keyword = String(req.query.keyword || '');

    const blogs = await OgboniBlog.find({
      title: {
        $regex: keyword,
        $options: 'i',
      },

      published: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error: any) {
    console.error('❌ Search Ogboni Blogs Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
