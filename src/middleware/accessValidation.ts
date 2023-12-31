import { admin } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface ValidationRequest extends Request {
    adminData: admin;
}

const accessValidation = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.apiKey) {
        let apiKey = req.query.apiKey;

        try {
            const response = await prisma.api_key.findUnique({
                where: {
                    key: String(apiKey),
                },
            });

            console.log(response);
            
            if (response) {
                console.log(apiKey);
            } else {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        
    } else {
        const validationReq = req as ValidationRequest
        const {authorization} = validationReq.headers;

        // console.log('here: ', authorization)

        if(!authorization){
            return res.status(401).json({
                message: 'Token not found'
            })
        }

        const token = authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET!;

        try {
            const jwtDecode = jwt.verify(token, secret);

            if(typeof jwtDecode !== 'string'){
                validationReq.adminData = jwtDecode as admin;
            }
        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
    }
    next()
}

export default accessValidation;