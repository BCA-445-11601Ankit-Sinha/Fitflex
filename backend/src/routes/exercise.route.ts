import { Router } from "express";

import { createExercise, getExercisesByFilter, getExerciseBySlug, searchExercises, updateExercise, deleteExercise } from "../controller/exercise.controller";
import { verifyToken } from "../middleware/verifyToken";
import { adminOnly } from "../middleware/roleCheck";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();   

router.post('/', verifyToken, adminOnly, asyncHandler(createExercise));
router.get('/', asyncHandler(getExercisesByFilter));
router.get('/search', asyncHandler(searchExercises));
router.get('/:slug', asyncHandler(getExerciseBySlug));
router.put('/:id', verifyToken, adminOnly, asyncHandler(updateExercise));
router.delete('/:id', verifyToken, adminOnly, asyncHandler(deleteExercise));

export default router;
