import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: false
    },
    imageUrl:[
        {
            type: String,
        }
    ],
    videoUrl: [
        {
            type: String,
        }
    ],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    set:{
        type: String,
        required: true
    },
    targetMuscle: [
        {
            type: String,
        }
    ],
    process:{
        type: String,
        required: true
    },
    muscleGroup: {
        type: String,
        enum: ['chest', 'back', 'legs', 'arms', 'shoulders', 'core'],
        required: true,
    }
},{timestamps: true});

export const Exercise = mongoose.model('Exercise', exerciseSchema);
export type ExerciseType = mongoose.InferSchemaType<typeof exerciseSchema>;