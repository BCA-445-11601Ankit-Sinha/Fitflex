import { Router } from "express";
import {
    createUser,
    logInUser,
    updateUser,
    getMe,
    updateMe,
    changePassword,
    deleteAccount,
    requestPasswordResetOtp,
    resetPasswordWithOtp,
} from "../controller/user.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";
import generateCloudinarySignature from "../config/cloudinarySignature";

const router = Router();

router.post("/", asyncHandler(createUser));
router.post("/login", asyncHandler(logInUser));
router.post("/forgot-password/request-otp", asyncHandler(requestPasswordResetOtp));
router.post("/forgot-password/reset", asyncHandler(resetPasswordWithOtp));

// Protected routes (current user)
router.get("/me", verifyToken, asyncHandler(getMe));
router.put("/me", verifyToken, asyncHandler(updateMe));
router.post("/change-password", verifyToken, asyncHandler(changePassword));
router.delete("/me", verifyToken, asyncHandler(deleteAccount));
router.get("/presigned-url", verifyToken, asyncHandler(generateCloudinarySignature));

router.put("/:id", asyncHandler(updateUser));

export default router;
