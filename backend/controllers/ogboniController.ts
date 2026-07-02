import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import OgboniMember from '../models/OgboniMember';
import { sendApprovalEmail } from '../utils/sendEmail';

// ================= REGISTER =================
export const registerMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('================ REGISTER REQUEST ================');
    console.log(req.body);

    const {
      username,
      email,
      password,
      fullName,
      phoneNumber,
      gender,
      dateOfBirth,
      occupation,
      chiefTitle,
      state,
      lga,
      city,
      address,
      reason,
    } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Username, email and password are required',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await OgboniMember.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await OgboniMember.create({
      username: username.trim(),
      email: cleanEmail,
      password: hashedPassword,

      fullName,
      phoneNumber,
      gender,
      dateOfBirth,
      occupation,
      chiefTitle,
      state,
      lga,
      city,
      address,
      reason,

      approved: false,
    });

    console.log('REGISTER SUCCESS:', user._id);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      user,
    });
  } catch (error: any) {
    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      success: false,
      message: error?.message || 'Server error',
    });
  }
};

// ================= LOGIN =================
export const loginMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await OgboniMember.findOne({
      email: cleanEmail,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.approved) {
      res.status(403).json({
        success: false,
        message: 'Not approved yet',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error: any) {
    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      success: false,
      message: error?.message || 'Server error',
    });
  }
};

// ================= GET MEMBERS =================
export const getAllMembers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const members = await OgboniMember.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      members,
    });
  } catch (error: any) {
    console.error('FETCH ERROR:', error);

    res.status(500).json({
      success: false,
      message: error?.message || 'Server error',
    });
  }
};

// ================= APPROVE MEMBER =================
export const approveMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('🚀 APPROVE MEMBER ROUTE HIT');

    const member = await OgboniMember.findById(req.params.id);

    if (!member) {
      console.log('❌ Member not found');

      res.status(404).json({
        success: false,
        message: 'Member not found',
      });
      return;
    }

    console.log('✅ Member Found');
    console.log('ID:', member._id);
    console.log('Name:', member.fullName);
    console.log('Email:', member.email);

    member.approved = true;
    await member.save();

    console.log('✅ Member approved in database');

    console.log('📧 Calling sendApprovalEmail...');

    const emailResult = await sendApprovalEmail(
      member.email,
      member.fullName || member.username,
    );

    console.log('📨 Email Result:', emailResult);

    res.status(200).json({
      success: true,
      message: 'Member approved successfully',
      member,
    });
  } catch (error: any) {
    console.error('❌ APPROVAL ERROR:', error);

    res.status(500).json({
      success: false,
      message: error?.message || 'Server error',
    });
  }
};
