import { Request, Response, NextFunction } from 'express';

import IlediOgboniPost from '../models/IlediOgboniPost';
import AppError from '../utils/appError';

/**
 * GET ALL POSTS
 * Used by the private Ogboni member community feed.
 */
export const getIlediOgboniPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await IlediOgboniPost.find()
      .populate({
        path: 'author',
        select: 'firstname lastname fullname username photo',
      })
      .populate({
        path: 'comments.member',
        select: 'fullName username photo',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE POST
 * Admin/developer only.
 */
export const createIlediOgboniPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(
        new AppError('You must be logged in as an administrator.', 401),
      );
    }

    const { content, image } = req.body;

    if (!content || !content.trim()) {
      return next(new AppError('Post content is required.', 400));
    }

    const post = await IlediOgboniPost.create({
      author: req.user._id,
      content: content.trim(),
      image: image || '',
    });

    const populatedPost = await IlediOgboniPost.findById(post._id)
      .populate({
        path: 'author',
        select: 'firstname lastname fullname username photo',
      })
      .populate({
        path: 'comments.member',
        select: 'fullName username photo',
      });

    res.status(201).json({
      success: true,
      message: 'Iledi Ogboni post created successfully.',
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE POST
 * Admin/developer only.
 */
export const updateIlediOgboniPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { content, image } = req.body;

    const post = await IlediOgboniPost.findById(id);

    if (!post) {
      return next(new AppError('Iledi Ogboni post not found.', 404));
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return next(new AppError('Post content cannot be empty.', 400));
      }

      post.content = content.trim();
    }

    if (image !== undefined) {
      post.image = image;
    }

    await post.save();

    const updatedPost = await IlediOgboniPost.findById(post._id)
      .populate({
        path: 'author',
        select: 'firstname lastname fullname username photo',
      })
      .populate({
        path: 'comments.member',
        select: 'fullName username photo',
      });

    res.status(200).json({
      success: true,
      message: 'Iledi Ogboni post updated successfully.',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE POST
 * Admin/developer only.
 */
export const deleteIlediOgboniPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const post = await IlediOgboniPost.findByIdAndDelete(id);

    if (!post) {
      return next(new AppError('Iledi Ogboni post not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Iledi Ogboni post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * LIKE / UNLIKE POST
 * Approved Ogboni members only.
 */
export const toggleIlediOgboniPostLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.ogboniMember) {
      return next(new AppError('Ogboni member authentication required.', 401));
    }

    const { id } = req.params;
    const memberId = req.ogboniMember._id;

    const post = await IlediOgboniPost.findById(id);

    if (!post) {
      return next(new AppError('Iledi Ogboni post not found.', 404));
    }

    const alreadyLiked = post.likes.some(
      (like) => like.toString() === memberId.toString(),
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== memberId.toString(),
      );
    } else {
      post.likes.push(memberId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADD COMMENT
 * Approved Ogboni members only.
 */
export const addIlediOgboniPostComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.ogboniMember) {
      return next(new AppError('Ogboni member authentication required.', 401));
    }

    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return next(new AppError('Comment content is required.', 400));
    }

    const post = await IlediOgboniPost.findById(id);

    if (!post) {
      return next(new AppError('Iledi Ogboni post not found.', 404));
    }

    post.comments.push({
      member: req.ogboniMember._id,
      content: content.trim(),
    });

    await post.save();

    const updatedPost = await IlediOgboniPost.findById(post._id).populate({
      path: 'comments.member',
      select: 'fullName username photo',
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE COMMENT
 * Comment owner or admin/developer.
 */
export const deleteIlediOgboniPostComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, commentId } = req.params;

    const post = await IlediOgboniPost.findById(id);

    if (!post) {
      return next(new AppError('Iledi Ogboni post not found.', 404));
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return next(new AppError('Comment not found.', 404));
    }

    const isAdmin = !!req.user;

    const isCommentOwner =
      !!req.ogboniMember &&
      comment.member.toString() === req.ogboniMember._id.toString();

    if (!isAdmin && !isCommentOwner) {
      return next(
        new AppError('You are not allowed to delete this comment.', 403),
      );
    }

    comment.deleteOne();

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
