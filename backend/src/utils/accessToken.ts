import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

export const generateAccessToken = (userId: string) => {
    const payload = { userId };
    const secretKey = process.env.JWT_SECRET_KEY 
    return jwt.sign(payload, secretKey!, { expiresIn: '10h' });
};

export const verifyAccessToken = (token: string) => {
    const secretKey = process.env.JWT_SECRET_KEY 
    try {
        const decoded = jwt.verify(token, secretKey!);
        return decoded as { userId: string };
    } catch (error) {
        throw new AppError(401, 'Invalid token');
    }
};  