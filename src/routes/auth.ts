import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.admin.create({
        data: {
            username,
            email,
            password: hashedPassword,
        }
    })

    res.json({
        message: 'Admin created successfully'
    })
});

// Login
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const admin = await prisma.admin.findFirst({
        where: {
            username: username,
        }
    })

    if(!admin) {
        return res.status(404).json({
            message: 'Admin not found'
        })
    }

    if(!admin.password) {
        return res.status(404).json({
            message: 'Password not set'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if(isPasswordValid){
        const payload = {
            admin_id: admin.admin_id,
            username: admin.username,
            profile_img: admin.profile_img,
            desc: admin.desc,
        }

        const secret = process.env.JWT_SECRET!;

        const expiresIn = 60 * 60 * 1;

        const token = jwt.sign(payload, secret, {expiresIn: expiresIn})

        return res.json({
            data: {
                id: admin.admin_id,
                username: admin.username,
                profile_img: admin.profile_img,
                desc: admin.desc,
            },
            token: token
        })
    } else {
        return res.status(403).json({
            message: 'Incorrect password'
        })
    }
});

export default router;