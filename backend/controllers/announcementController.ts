import { Request, Response } from 'express';
import Announcement from '../models/announcementModel';

// ================================
// CREATE
// ================================

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    // Only one announcement can be pinned
    if (req.body.pinned === true || req.body.pinned === 'true') {
      await Announcement.updateMany({}, { pinned: false });
    }

    const announcement = await Announcement.create({
      title: req.body.title,
      message: req.body.message,
      category: req.body.category,
      pinned: req.body.pinned === true || req.body.pinned === 'true',
      image: req.body.images?.[0] || '',
    });

    res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// GET ALL
// ================================

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({
      pinned: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// UPDATE
// ================================

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    if (req.body.pinned === true || req.body.pinned === 'true') {
      await Announcement.updateMany({}, { pinned: false });
    }

    const updateData: any = {};

    if (req.body.title !== undefined) updateData.title = req.body.title;

    if (req.body.message !== undefined) updateData.message = req.body.message;

    if (req.body.category !== undefined)
      updateData.category = req.body.category;

    if (req.body.active !== undefined) {
      updateData.active =
        req.body.active === true || req.body.active === 'true';
    }

    if (req.body.pinned !== undefined) {
      updateData.pinned =
        req.body.pinned === true || req.body.pinned === 'true';
    }

    // image upload
    if (req.body.image) {
      updateData.image = req.body.image;
    }

    if (req.body.images?.length) {
      updateData.image = req.body.images[0];
    }

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// DELETE
// ================================

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
