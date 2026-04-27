import axiosInstance from "@/lib/axios";

const baseUrl = 'api/products';


export type createProductData = {
    name:string;
    slug:string;
    description:string;
    price:number;
    imageUrl:string[] | undefined;
    type:string;
}



export const createProduct = async (data: createProductData) => {
    const response = await axiosInstance.post(`${baseUrl}/`, data ) ;
    return response.data;
}

export const getAllProducts = async ({ page = 1, limit = 10 }: { page: number, limit?: number }) => {
    const response = await axiosInstance.get(`${baseUrl}/?page=${page}&limit=${limit}`);
    return response.data;
}

export const getProductBySlug = async (slug: string) => {
    const response = await axiosInstance.get(`${baseUrl}/${slug}`);
    return response.data;
}

export const updateProduct = async (id: string, data: createProductData) => {
    const response = await axiosInstance.put(`${baseUrl}/${id}`, data);
    return response.data;
}

export const searchProducts = async (query: string) => {
    const response = await axiosInstance.get(`${baseUrl}/search?q=${encodeURIComponent(query)}`);
    return response.data;
}

export const deleteProduct = async (id: string) => {
    const response = await axiosInstance.delete(`${baseUrl}/${id}`);
    return response.data;
}

export const getProductsByType = async (type: string) => {
    const response = await axiosInstance.get(`${baseUrl}/type/${type}`);
    return response.data;
}
