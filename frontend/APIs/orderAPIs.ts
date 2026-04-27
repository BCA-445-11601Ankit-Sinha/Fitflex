import axiosInstance from "@/lib/axios";

const baseUrl = "api/orders";

export type OrderStatus = "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type Order = {
    _id: string;
    userId: string;
    cartId: string;
    totalPrice: number;
    deliveryAddress: string;
    status?: OrderStatus;
    createdAt?: string;
    updatedAt?: string;
};

export const createOrder = async (cartId: string, deliveryAddress: string) => {
    const response = await axiosInstance.post(`${baseUrl}/`, { cartId, deliveryAddress });
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axiosInstance.get(`${baseUrl}/`);
    return response.data;
};

export const getOrderById = async (orderId: string) => {
    const response = await axiosInstance.get(`${baseUrl}/${orderId}`);
    return response.data;
};

export const getAdminOrders = async () => {
    const response = await axiosInstance.get(`${baseUrl}/admin/all`);
    return response.data;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const response = await axiosInstance.patch(`${baseUrl}/admin/${orderId}/status`, { status });
    return response.data;
};
