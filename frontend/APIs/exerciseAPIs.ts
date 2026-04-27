const baseURL = 'api/exercises';
import axiosInstance from "@/lib/axios";

export  type ExerciseType = {
    name: string;
    slug: string;
    description: string;
    imageUrl?: string[];
    videoUrl?: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    set: string;
}


export const getExercisesByFilter = async ({ muscleGroup, difficulty, page, limit }: { muscleGroup?: string, difficulty?: string, page?: number, limit?: number }) => {
    const queryParams = new URLSearchParams();

    if (muscleGroup) {
        queryParams.append('muscleGroup', muscleGroup);
    }

    if (difficulty) {
        queryParams.append('difficulty', difficulty);
    }
    if (page) {
        queryParams.append('page', page.toString());
    }
    if (limit) {
        queryParams.append('limit', limit.toString());
    }

    const response = await axiosInstance.get(`${baseURL}/?${queryParams.toString()}`);
    const data = await response.data;
    console.log('data', data);
    return data;
}

export const createExercise = async (exerciseData: any) => {
    const response = await axiosInstance.post(`${baseURL}/`, exerciseData);
    return response.data;
}

export const getExerciseBySlug = async (slug: string) => {
    const response = await axiosInstance.get(`${baseURL}/${slug}`);
    return response.data;
}

export const updateExercise = async (id: string, exerciseData: any) => {
    const response = await axiosInstance.put(`${baseURL}/${id}`, exerciseData);
    return response.data;
}

export const deleteExercise = async (id: string) => {
    const response = await axiosInstance.delete(`${baseURL}/${id}`);
    return response.data;
}

export const searchExercises = async (query: string) => {
    const response = await axiosInstance.get(`${baseURL}/search?q=${encodeURIComponent(query)}`);
    return response.data;
}