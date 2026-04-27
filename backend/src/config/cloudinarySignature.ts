import{ v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/AppError';
import dotenv from 'dotenv';
import { type Request, type Response } from 'express';

dotenv.config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new AppError(500, 'Cloudinary credentials are not set in environment variables.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const generateCloudinarySignature = (req: Request, res: Response) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            folder: 'fitflex',
        },
        process.env.CLOUDINARY_API_SECRET!
    )
    res.status(200).json({
        success: true,
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        folder: 'fitflex',
    });
};

export default generateCloudinarySignature;