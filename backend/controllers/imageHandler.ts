import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { Request } from 'express';

// ===================== CLOUDINARY =====================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===================== MULTER =====================

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  console.log('Uploading file:', file.originalname);

  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only images are allowed', 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// ===================== EXPORTS =====================

export const noUpload = () => upload.none();

export const uploadPhoto = () => upload.single('image');

export const multiplePhotos = (fields: { name: string; maxCount: number }[]) =>
  upload.fields(fields);

export const multipleSinglePhotos = (field: {
  name: string;
  maxCount: number;
}) => upload.array(field.name, field.maxCount);

// ===================== CLOUDINARY UPLOAD =====================

export const cloudUpload = (folder: string) =>
  catchAsync(async (req, res, next) => {
    console.log('FILE RECEIVED:');
    console.log(req.file);

    console.log('FILES RECEIVED:');
    console.log(req.files);

    let files: Express.Multer.File[] = [];

    // upload.single(...)
    if (req.file) {
      files = [req.file];
    }

    // upload.array(...)
    else if (Array.isArray(req.files)) {
      files = req.files;
    }

    // upload.fields(...)
    else if (req.files && typeof req.files === 'object') {
      files = Object.values(req.files).flat() as Express.Multer.File[];
    }

    if (!files.length) {
      console.log('NO FILES FOUND');

      req.body.images = [];

      return next();
    }

    const uploadImage = (file: Express.Multer.File): Promise<string> =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            public_id: `upload-${Date.now()}-${crypto
              .randomBytes(6)
              .toString('hex')}`,
            transformation: [
              {
                width: 2000,
                height: 2000,
                crop: 'limit',
              },
            ],
          },
          (error, result) => {
            if (error) {
              return reject(new AppError(error.message, 500));
            }

            resolve(result!.secure_url);
          },
        );

        stream.end(file.buffer);
      });

    const uploadedImages = await Promise.all(files.map(uploadImage));

    console.log('CLOUDINARY IMAGES:', uploadedImages);

    req.body.images = uploadedImages;

    next();
  });
// ===================== PROCESS =====================

export const processMultipleImages = catchAsync(async (req, res, next) => {
  if (!req.body.images) {
    req.body.images = [];
  }

  next();
});
