import multer, { FileFilterCallback, Multer } from 'multer';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image', 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const noUpload = () => upload.none();

export const uploadPhoto = () => upload.single('image');

export const multiplePhotos = (entries: { name: string; maxCount: number }[]) =>
  upload.fields([...entries]);

export const multipleSinglePhotos = (entry: {
  name: string;
  maxCount: number;
}) => {
  return upload.array(entry.name, entry.maxCount);
};

export const cloudUpload = (type: string) =>
  catchAsync(async (req, res, next) => {
    const cloudinaryUpload = (buffer: Buffer, fileName: string) =>
      new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: type,
            format: 'webp',
            allowed_formats: ['webp'],
            transformation: [{ width: 2500, height: 2500, crop: 'limit' }],
            public_id: `OA_${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${fileName}`,
          },
          (error, result) => {
            if (error)
              reject(
                new AppError(`Cloudinary upload error: ${error.message}`, 500),
              );
            else resolve(result!.secure_url);
          },
        );

        uploadStream.end(buffer);
      });

    let files: Express.Multer.File[] = [];

    if (req.file) {
      files = [req.file];
    } else if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files && typeof req.files === 'object') {
      files = Object.values(req.files).flat() as Express.Multer.File[];
    }

    if (files.length === 0) {
      return next(new AppError('No file detected', 500));
    }

    const uploadResults = await Promise.all(
      files.map((file) => cloudinaryUpload(file.buffer, file.originalname)),
    );

    req.body.images = uploadResults; // Store URLs directly

    next();
  });

export const processMultipleImages = catchAsync(async (req, res, next) => {
  if (req.files && Array.isArray(req.files)) {
    const fileImages = req.files.map(
      (image: Express.Multer.File) => image.path,
    );
    if (req.body.images) {
      if (!Array.isArray(req.body.images)) {
        req.body.images = [req.body.images];
      }
      req.body.images = [...req.body.images, ...fileImages];
    } else {
      req.body.images = fileImages;
    }
  }
  next();
});
