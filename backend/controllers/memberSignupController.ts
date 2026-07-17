import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import MemberSignupRequest from '../models/memberSignupRequest';
import User from '../models/userModel';

// ======================================================
// SUBMIT SIGNUP REQUEST
// ======================================================

export const signupRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const existingRequest = await MemberSignupRequest.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (existingRequest) {
      res.status(400).json({
        success: false,
        message: 'A signup request already exists for this user.',
      });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'A user with this email or username already exists.',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const request = await MemberSignupRequest.create({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      gender: req.body.gender,
      occupation: req.body.occupation,
      chieftaincyTitle: req.body.chieftaincyTitle,
      state: req.body.state,
      localGovernment: req.body.localGovernment,
      city: req.body.city,
      address: req.body.address,
      photo: req.body.images?.[0] || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message:
        'Your registration request has been submitted successfully and is awaiting administrator approval.',
      request,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL SIGNUP REQUESTS
// ======================================================

export const getSignupRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const requests = await MemberSignupRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// APPROVE SIGNUP REQUEST
// ======================================================

export const approveSignupRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const request = await MemberSignupRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Signup request not found.',
      });
      return;
    }

    if (request.status === 'Approved') {
      res.status(400).json({
        success: false,
        message: 'This request has already been approved.',
      });
      return;
    }

    await User.create({
      fullname: request.fullname,

      firstname: request.fullname.split(' ')[0],

      lastname:
        request.fullname.split(' ').slice(1).join(' ') ||
        request.fullname.split(' ')[0],

      username: request.username,

      email: request.email,

      password: request.password,

      passwordConfirm: request.password,

      phone: request.phone,

      gender: request.gender,

      occupation: request.occupation,

      chieftaincyTitle: request.chieftaincyTitle,

      state: request.state,

      localGovernment: request.localGovernment,

      city: request.city,

      address: request.address,

      photo: request.photo,

      role: 'member',

      approvalStatus: 'Approved',
    });

    request.status = 'Approved';
    request.approvedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Signup request approved successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// REJECT SIGNUP REQUEST
// ======================================================

export const rejectSignupRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const request = await MemberSignupRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Signup request not found.',
      });
      return;
    }

    request.status = 'Rejected';

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Signup request rejected.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
