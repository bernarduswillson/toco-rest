import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create option
router.post('/create', accessValidation, async (req, res) => {
    const { question_id, option, is_correct } = req.body;

    try {
        const result = await prisma.option.create({
            data: {
                question_id,
                option,
                is_correct
            }
        });

        res.json({
            message: 'Option created successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating the option',
        });
    }
});

// Update option
router.put('/update/:o_id', accessValidation, async (req, res) => {
    const { option_id } = req.params;
    const { question_id, option, is_correct } = req.body;

    try {
        const result = await prisma.option.update({
            where: {
                option_id: parseInt(option_id),
            },
            data: {
                question_id,
                option,
                is_correct
            },
        });

        res.json({
            message: 'Option updated successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating the option',
        });
    }
});

// Delete option
router.delete('/delete/:o_id', accessValidation, async (req, res) => {
    const { option_id } = req.params;

    try {
        const result = await prisma.option.delete({
            where: {
                option_id: parseInt(option_id),
            },
        });

        res.json({
            message: 'Option deleted successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while deleting the option',
        });
    }
});

// Get options from question
router.get('/:q_id', async (req, res) => {
    const { q_id } = req.params;

    try {
        const result = await prisma.option.findMany({
            where: {
                question_id: parseInt(q_id),
            },
            select: {
                option_id: true,
                question_id: true,
                option: true,
            },
        });

        res.json({
            message: 'Options retrieved successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the options',
        });
    }
});


export default router;