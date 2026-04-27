import { type Request, type Response, type NextFunction } from 'express';
import { verifyToken } from './verifyToken';
import { AppError } from '../utils/AppError';
import  User  from '../models/user.models';

export const roleCheck = (requiredRole: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
             const user = await User.findById(req.userId)
             .select('role')
             .lean();

             const userRole = user?.role;
             if (!userRole) {
                throw new AppError(404, 'User not found');
             }
             if (userRole !== requiredRole) {
                throw new AppError(403, 'Forbidden: Insufficient permissions');
             }
             next();
        } catch (error) {
            next(error);
        }
    };
};   

export const adminOnly = roleCheck('admin');