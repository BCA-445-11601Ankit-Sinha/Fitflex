import axiosInstance from "@/lib/axios";

const baseUrl = "api/users";

export type createUserData = {
    name: string;
    email: string;
    password: string;
};

export const createUser = async (userData: createUserData) => {
    const response = await axiosInstance.post(`${baseUrl}/`, userData, {
        skipGlobalErrorToast: true,
    });
    return response.data;
};

export type loginUserData = {
    email: string;
    password: string;
};

export const logInUser = async (userData: loginUserData) => {
    const response = await axiosInstance.post(`${baseUrl}/login`, userData, {
        skipGlobalErrorToast: true,
    });
    return response.data;
};

export const requestPasswordResetOtp = async (email: string) => {
    const response = await axiosInstance.post(
        `${baseUrl}/forgot-password/request-otp`,
        { email },
        { skipGlobalErrorToast: true }
    );
    return response.data as { success: boolean; message: string };
};

export const resetPasswordWithOtp = async (payload: {
    email: string;
    otp: string;
    newPassword: string;
}) => {
    const response = await axiosInstance.post(`${baseUrl}/forgot-password/reset`, payload, {
        skipGlobalErrorToast: true,
    });
    return response.data as { success: boolean; message: string };
};

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    role?: "admin" | "user";
};

export const getMe = async (): Promise<{ success: boolean; data: UserProfile }> => {
    const response = await axiosInstance.get(`${baseUrl}/me`, {
        skipGlobalErrorToast: true,
    });
    return response.data;
};

export type updateUserData = {
    name?: string;
    photoURL?: string;
};

export const updateProfile = async (userData: updateUserData): Promise<{ success: boolean; data: UserProfile }> => {
    const response = await axiosInstance.put(`${baseUrl}/me`, userData, {
        skipGlobalErrorToast: true,
        skipGlobalSuccessToast: true,
    });
    return response.data;
};

export const updateUser = async (userId: string, userData: updateUserData) => {
    const response = await axiosInstance.put(`${baseUrl}/${userId}`, userData);
    return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await axiosInstance.post(
        `${baseUrl}/change-password`,
        {
            currentPassword,
            newPassword,
        },
        { skipGlobalErrorToast: true, skipGlobalSuccessToast: true }
    );
    return response.data;
};

export const deleteAccount = async (password: string) => {
    const response = await axiosInstance.delete(`${baseUrl}/me`, {
        data: { password },
        skipGlobalErrorToast: true,
        skipGlobalSuccessToast: true,
    });
    return response.data;
};

export const getPresignedUrl = async () => {
    const response = await axiosInstance.get(`${baseUrl}/presigned-url`);
    return response.data;
};