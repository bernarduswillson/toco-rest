import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create question
router.post('/create', accessValidation, async (req, res) => {
    const { exercise_id, question } = req.body;

    try {
        const result = await prisma.question.create({
            data: {
                exercise_id,
                question
            }
        });

        res.json({
            message: 'Question created successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating the question',
        });
    }
});

// Update question
router.put('/update/:q_id', accessValidation, async (req, res) => {
    const { question_id } = req.params;
    const { exercise_id, question } = req.body;

    try {
        const result = await prisma.question.update({
            where: {
                question_id: parseInt(question_id),
            },
            data: {
                exercise_id,
                question
            },
        });

        res.json({
            message: 'Question updated successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating the question',
        });
    }
});

// Delete question
router.delete('/delete/:q_id', accessValidation, async (req, res) => {
    const { question_id } = req.params;

    try {
        const result = await prisma.question.delete({
            where: {
                question_id: parseInt(question_id),
            },
        });

        res.json({
            message: 'Question deleted successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while deleting the question',
        });
    }
});

// Get questions from exercise
router.get('/:exe_id', accessValidation, async (req, res) => {
    const { exe_id } = req.params;

    try {
        const result = await prisma.question.findMany({
            where: {
                exercise_id: parseInt(exe_id),
            },
            select: {
                question_id: true,
                exercise_id: true,
                question: true
            },
        });

        res.json({
            message: 'questions retrieved successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the questions',
        });
    }
});

// Get questions count
router.get('/count/:exe_id', accessValidation, async (req, res) => {
    const { exe_id } = req.params;

    try {
        const result = await prisma.question.count({
            where: {
                exercise_id: parseInt(exe_id),
            },
        });

        res.json({
            message: 'Questions count retrieved successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the questions count',
        });
    }
});


export default router;