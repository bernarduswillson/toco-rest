import express from 'express';
import { PrismaClient } from '@prisma/client';
import accessValidation from '../middleware/accessValidation';

const router = express.Router();
const prisma = new PrismaClient();

// Create
router.post('/', accessValidation, async (req, res, next) => {
    const {name, email, address} = req.body;

    const result = await prisma.users.create({
        data: {
            name: name,
            email: email,
            address: address
        }
    }) 
    res.json({
        data: result,
        message: `User created`
    })
});

// Read
router.get('/', accessValidation, async (req, res) => {
    const result = await prisma.users.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
        }
    });
    res.json({
        data: result,
        message: 'User list'
    })
});

// Update
router.patch('/:id', accessValidation, async (req, res) => {
    const {id} = req.params
    const {name, email, address} = req.body
    
    const result = await prisma.users.update({
        data: {
            name: name,
            email: email,
            address: address,
        },
        where: {
            id: Number(id)
        }
    })
    res.json({
        data: result,
        message: `User ${id} updated`
    })
});

// Delete
router.delete('/:id', accessValidation, async (req, res) => {
    const {id} = req.params;

    const result = await prisma.users.delete({
        where: {
            id: Number(id)
        }
    })
    res.json({
        message: `User ${id} deleted`
    })
});

export default router;