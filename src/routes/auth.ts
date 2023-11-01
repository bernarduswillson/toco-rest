import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';

const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        // Create new admin
        await prisma.admin.create({
            data: {
                username,
                email,
                password: hashedPassword,
            }
        });
        
        return res.status(200).json({
            message: 'Register success'
        });
    } catch (error) {
        return res.status(404).json({
            message: 'Register failed'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    let isPasswordValid;
    let admin;

    // Validation
    try {
        admin = await prisma.admin.findFirst({
            where: {
                username: username,
            }
        });

        // Admin exists validation
        if(!admin) {
            throw error;
        }
    
        // Admin password validation
        if(!admin.password) {
            throw error;
        }

        isPasswordValid = await bcrypt.compare(password, admin.password);
    } catch (error) {
        return res.status(404).json({
            message: 'Incorrect username or password'
        });
    }
    

    if(isPasswordValid){
        const payload = {
            admin_id: admin.admin_id,
            username: admin.username,
            profile_img: admin.profile_img,
            desc: admin.desc,
        };

        // Create token secret
        const secret = process.env.JWT_SECRET!;

        // Create token expiration
        const expiresIn = 60 * 60 * 1;

        // Create token
        const token = jwt.sign(payload, secret, {expiresIn: expiresIn});

        return res.status(200).json({
            data: {
                id: admin.admin_id,
                username: admin.username,
                profile_img: admin.profile_img,
                desc: admin.desc,
            },
            token: token
        });
    } else {
        return res.status(403).json({
            message: 'Login failed'
        });
    }
});

export default router;