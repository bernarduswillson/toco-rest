import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// create progress
router.post('/create', accessValidation, async (req, res) => {
    const { user_id, exercise_id, score } = req.body;

    try {
        const result = await prisma.progress.create({
            data: {
                user_id,
                exercise_id,
                score
            }
        });

        res.json({
            message: 'Progress created successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating the progress',
        });
    }
});

// get progress by user_id
router.get('/user/:user_id', accessValidation, async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await prisma.progress.findMany({
            where: {
                user_id: Number(user_id)
            }
        });

        res.json({
            message: 'Progress retrieved successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the progress',
        });
    }
});

export default router;