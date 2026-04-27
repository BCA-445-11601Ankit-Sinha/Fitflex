import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken } from '../utils/accessToken';
import { AppError } from '../utils/AppError';
import {} from '../types/express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization
        console.log('token from auth', token);

        if (!token) {
            throw new AppError(401, 'No token provided');
        }

        const decoded = verifyAccessToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        throw new AppError(401, 'Invalid token');
    }
}