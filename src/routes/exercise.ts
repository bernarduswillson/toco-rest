import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create exercise
router.post('/create', accessValidation, async (req, res) => {
    const { exe_name, language_id, category, difficulty } = req.body;

    try {
        const result = await prisma.exercise.create({
            data: {
                exe_name,
                language_id,
                category,
                difficulty
            }
        });

        res.json({
            message: 'Exercise created successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating the exercise',
        });
    }
});

// Update exercise
router.put('/update/:exe_id', accessValidation, async (req, res) => {
    const { exercise_id } = req.params;
    const { exe_name, language_id, category, difficulty } = req.body;

    try {
        const result = await prisma.exercise.update({
            where: {
                exercise_id: parseInt(exercise_id),
            },
            data: {
                exe_name,
                language_id,
                category,
                difficulty,
            },
        });

        res.json({
            message: 'Exercise updated successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating the exercise',
        });
    }
});

// Delete exercise
router.delete('/delete/:exe_id', accessValidation, async (req, res) => {
    const { exercise_id } = req.params;

    try {
        const result = await prisma.exercise.delete({
            where: {
                exercise_id: parseInt(exercise_id),
            },
        });

        res.json({
            message: 'Exercise deleted successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while deleting the exercise',
        });
    }
});

// Get all exercises
router.get('/', async (req, res) => {
    try {
        const result = await prisma.exercise.findMany({
            select: {
                exercise_id: true,
                exe_name: true,
                language_id: true,
                category: true,
                difficulty: true,
            },
        });

        res.json({
            message: 'Exercises retrieved successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the exercises',
        });
    }
});


export default router;
