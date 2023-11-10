import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

type Results = {
    [question_id: number]: string | null;
};

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

// Get exercises from languages
router.get('/:lang_id', async (req, res) => {
    const { lang_id } = req.params;

    try {
        const result = await prisma.exercise.findMany({
            where: {
                language_id: parseInt(lang_id),
            },
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

// Check score
router.post('/result/:exercise_id', async (req, res) => {
    const { exercise_id } = req.params;
    const selectedOptions = req.body;

    try {
        const result = await prisma.exercise.findUnique({
            where: {
                exercise_id: parseInt(exercise_id),
            },
            select: {
                exercise_id: true,
                questions: {
                    select: {
                        question_id: true,
                        question: true,
                        options: {
                            select: {
                                option_id: true,
                                option: true,
                                is_correct: true,
                            },
                        },
                    },
                },
            },
        });

        const correctResults: Results = {};
        const wrongResults: Results = {};

        if (result !== null) {
            result.questions.forEach((question) => {
                const selectedOption = selectedOptions[`question_${question.question_id}`];
                if (selectedOption !== undefined) {
                    const isCorrect = question.options.find(
                        (opt) => opt.option_id === parseInt(selectedOption) && opt.is_correct
                    );

                    if (isCorrect) {
                        correctResults[question.question_id] = selectedOption;
                    } else {
                        wrongResults[question.question_id] = selectedOption;
                    }
                } else {
                    const correctAnswer = question.options.find((opt) => opt.is_correct);
                    wrongResults[question.question_id] = correctAnswer ? correctAnswer.option_id.toString() : null;
                }
            });
        }

        res.json({
            message: 'Exercise result retrieved successfully',
            correctResults,
            wrongResults,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the exercise result',
        });
    }
});


export default router;
