import axiosInstance from "@/lib/axios";

const baseUrl = "api/cart";

export type CartItem = {
    productId: { _id: string; name: string; slug: string; price: number; imageUrl?: string[] };
    quantity: number;
};

export type Cart = {
    _id: string;
    userId: string;
    items: CartItem[];
    total_price: number;
    cart_status: string;
    createdAt?: string;
    updatedAt?: string;
};

export const getCart = async () => {
    const response = await axiosInstance.get(`${baseUrl}/`);
    return response.data;
};

export const getOrCreateCart = async () => {
    const response = await axiosInstance.get(`${baseUrl}/get-or-create`);
    return response.data;
};

export const addToCart = async (productId: string, quantity: number = 1) => {
    const response = await axiosInstance.post(`${baseUrl}/add`, { productId, quantity });
    return response.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
    const response = await axiosInstance.patch(`${baseUrl}/item`, { productId, quantity });
    return response.data;
};

export const removeFromCart = async (productId: string) => {
    const response = await axiosInstance.delete(`${baseUrl}/item/${productId}`);
    return response.data;
};
