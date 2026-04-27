// create a new user
import { type Request, type Response } from 'express';
import { randomInt } from 'crypto';
import User from '../models/user.models';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../utils/accessToken';
import { sendEmail, sendPasswordResetOtpEmail } from '../utils/sendMail';

const PASSWORD_RESET_OTP_MS = 15 * 60 * 1000;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new AppError(400, 'Name, email and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError(400, 'Email already in use');
    }

    const hassedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        fullName: name,
        email,
        password: hassedPassword,
    });

    await user.save();

    sendEmail(email, 'Welcome to FitFlex', name, "signUp")
    .catch((error) => {
        console.error('Error sending email:', error);
    });

    res.status(201).json({
        success: true,
        data: {
            id: user._id,
            name: user.fullName,
            email: user.email,
        },
    });
}


// get current user (profile)
export const getMe = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const user = await User.findById(userId).select('-password').lean();
    if (!user) throw new AppError(404, 'User not found');

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.fullName,
            email: user.email,
            photoURL: user.photoURL ?? '',
            role: user.role,
        },
    });
};

// update current user (profile) - name and/or photoURL
export const updateMe = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { name, photoURL } = req.body;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const user = await User.findById(userId);
    if (!user) throw new AppError(404, 'User not found');

    if (typeof name === 'string' && name.trim()) {
        user.fullName = name.trim();
    }
    if (typeof photoURL === 'string') {
        user.photoURL = photoURL;
    }

    await user.save();

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.fullName,
            email: user.email,
            photoURL: user.photoURL ?? '',
            role: user.role,
        },
    });
};

// legacy: update user by id (keep for backward compatibility if needed)
export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { name, photoURL } = req.body;

    if (!name) {
        throw new AppError(400, 'name is required');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    if (name) user.fullName = name;
    if (photoURL !== undefined) user.photoURL = photoURL;

    await user.save();

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.fullName,
            email: user.email,
            photoURL: user.photoURL,
        },
    });
};

// change password for current user
export const changePassword = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if (!userId) throw new AppError(401, 'Unauthorized');
    if (!currentPassword || !newPassword) {
        throw new AppError(400, 'Current password and new password are required');
    }
    if (newPassword.length < 6) {
        throw new AppError(400, 'New password must be at least 6 characters');
    }

    const user = await User.findById(userId);
    if (!user) throw new AppError(404, 'User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError(401, 'Current password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
};

// delete current user account
export const deleteAccount = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { password } = req.body;
    if (!userId) throw new AppError(401, 'Unauthorized');
    if (!password) throw new AppError(400, 'Password is required to delete account');

    const user = await User.findById(userId);
    if (!user) throw new AppError(404, 'User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(401, 'Password is incorrect');

    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
};  


//logIn user
export const logInUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(401, 'no email found with this email address');
    }


    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError(401, 'Invalid email or password');
    }

    const token = generateAccessToken(user._id.toString());

    sendEmail(email, 'Login Alert', user.fullName, "logIn")
    .catch((error) => {
        console.error('Error sending email:', error);
    });

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.fullName,
            email: user.email,
            photoURL: user.photoURL,
            role: user.role,
        },
        token,
    });
}

/** Request a 6-digit OTP by email (no reset links). */
export const requestPasswordResetOtp = async (req: Request, res: Response) => {
    const { email } = req.body as { email?: string };
    const trimmed = email?.trim() ?? '';

    if (!trimmed || !isValidEmail(trimmed)) {
        throw new AppError(400, 'Please provide a valid email address');
    }

    const generic = {
        success: true,
        message: 'If an account exists for this email, a verification code has been sent.',
    };

    const user = await User.findOne({ email: trimmed }).select(
        '+passwordResetOtpHash +passwordResetOtpExpires'
    );

    if (!user) {
        res.status(200).json(generic);
        return;
    }

    const otp = String(randomInt(100000, 1_000_000));
    user.passwordResetOtpHash = await bcrypt.hash(otp, 10);
    user.passwordResetOtpExpires = new Date(Date.now() + PASSWORD_RESET_OTP_MS);
    await user.save();

    sendPasswordResetOtpEmail(user.email, user.fullName, otp).catch((err) => {
        console.error('Error sending password reset OTP email:', err);
    });

    res.status(200).json(generic);
};

/** Reset password using email + OTP (entered in the app). */
export const resetPasswordWithOtp = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body as {
        email?: string;
        otp?: string;
        newPassword?: string;
    };

    const trimmedEmail = email?.trim() ?? '';
    const otpStr = otp != null ? String(otp).trim() : '';

    if (!trimmedEmail || !otpStr || !newPassword) {
        throw new AppError(400, 'Email, verification code, and new password are required');
    }
    if (newPassword.length < 6) {
        throw new AppError(400, 'New password must be at least 6 characters');
    }
    if (!/^\d{6}$/.test(otpStr)) {
        throw new AppError(400, 'Verification code must be 6 digits');
    }

    const user = await User.findOne({ email: trimmedEmail }).select(
        '+password +passwordResetOtpHash +passwordResetOtpExpires'
    );

    if (!user?.passwordResetOtpHash || !user.passwordResetOtpExpires) {
        throw new AppError(400, 'Invalid or expired verification code');
    }

    if (user.passwordResetOtpExpires.getTime() < Date.now()) {
        throw new AppError(400, 'Invalid or expired verification code');
    }

    const match = await bcrypt.compare(otpStr, user.passwordResetOtpHash);
    if (!match) {
        throw new AppError(400, 'Invalid or expired verification code');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, {
        $set: { password: hashed },
        $unset: { passwordResetOtpHash: 1, passwordResetOtpExpires: 1 },
    });

    res.status(200).json({
        success: true,
        message: 'Password reset successfully. You can sign in with your new password.',
    });
};