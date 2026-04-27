import { type Request, type Response  } from "express";
import { Exercise, ExerciseType } from "../models/exercise.models";
import { AppError } from "../utils/AppError";


const difficultyEnum = ['beginner', 'intermediate', 'advanced'] as const;
const muscleGroupEnum = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core'] as const;

export const createExercise = async (req: Request, res: Response) => {

    const { name, slug, description, imageUrl, videoUrl, difficulty, set, targetMuscle, process, muscleGroup }: ExerciseType = req.body;

    if (!name || !slug || !muscleGroup || !description || !process || !set) {
        throw new AppError(400, 'Missing required fields: name, slug, description, process, muscleGroup, set are required');
    }

    const existedExercise = await Exercise.findOne({ slug });
    if (existedExercise) {
        throw new AppError(400, 'Exercise with this slug already exists');
    }

    const exercise = await Exercise.create({
        name,
        slug,
        description,
        ...imageUrl && { imageUrl },
        ...videoUrl && { videoUrl },
        difficulty,
        set,
        targetMuscle,
        process,
        muscleGroup
    });

    res.status(201).json({
        success: true,
        data: exercise
    }); 
}

//find all the exercise with the help of musclegroup
export const getExercisesByFilter = async (req: Request, res: Response) => {
    const { muscleGroup, difficulty, page, limit } = req.query;

    const filter: Partial<ExerciseType> = {};

    if (muscleGroup && muscleGroupEnum.includes(muscleGroup as any)) {
        filter.muscleGroup = muscleGroup as ExerciseType['muscleGroup'];
    }

    if (difficulty && difficultyEnum.includes(difficulty as any)) {
        filter.difficulty = difficulty as ExerciseType['difficulty'];
    }

    if (page && isNaN(Number(page))) {
        throw new AppError(400, 'Page must be a number');
    }

    if (limit && isNaN(Number(limit))) {
        throw new AppError(400, 'Limit must be a number');
    }

    const exercises = await Exercise.find(filter).skip(((Number(page) || 1) - 1) * (Number(limit) || 10)).limit(Number(limit) || 10).lean()
    .select('-__v -createdAt -updatedAt -description -process -targetMuscle -videoUrl -set')  
    console.log('count', exercises.length);


    res.status(200).json({
        success: true,
        exercises,
        totalCount: await Exercise.countDocuments(filter)
    });
};

//get exercise by slug
export const getExerciseBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (!slug) {
        throw new AppError(400, 'Slug is required');
    }

    const exercise = await Exercise.findOne({ slug });

    if (!exercise) {
        throw new AppError(404, 'Exercise not found');
    }

    res.status(200).json({
        success: true,
        data: exercise
    });
};

//get exercise by search query
export const searchExercises = async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        throw new AppError(400, 'Search query is required and must be a string');
    }

    const exercises = await Exercise.find({
        name: { $regex: q, $options: 'i' }
    }).select('-__v -createdAt -updatedAt -description -process -targetMuscle -videoUrl -set -difficulty -muscleGroup').lean();

    res.status(200).json({
        success: true,
        data: exercises
    });
}

export const updateExercise = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, description, imageUrl, videoUrl, difficulty, set, targetMuscle, process, muscleGroup }: ExerciseType = req.body;

    const exercise = await Exercise.findByIdAndUpdate(
        id,
        { name, slug, description, imageUrl, videoUrl, difficulty, set, targetMuscle, process, muscleGroup },
        { new: true }
    );

    if (!exercise) {
        throw new AppError(404, 'Exercise not found');
    }

    res.status(200).json({
        success: true,
        data: exercise
    });
};

export const deleteExercise = async (req: Request, res: Response) => {
    const { id } = req.params;

    const exercise = await Exercise.findByIdAndDelete(id);

    if (!exercise) {
        throw new AppError(404, 'Exercise not found');
    }

    res.status(200).json({
        success: true,
        message: 'Exercise deleted successfully'
    });
};

