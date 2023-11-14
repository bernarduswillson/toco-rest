import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create merch
router.post('/create', accessValidation, async (req, res) => {
    const { name, price, image, desc } = req.body;

    try {
        const result = await prisma.merchandise.create({
            data: {
                name,
                price,
                image,
                desc,
            }
        });

        res.json({
            message: 'Merch created successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating the merch',
        });
    }
});

// Get all merch
router.get('/', async (req, res) => {
    try {
        const result = await prisma.merchandise.findMany();

        res.json({
            message: 'Merch retrieved successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the merch',
        });
    }
});

// try buying merch (validate to SOAP)
router.post('/buy/:merch_id', async (req, res) => {
    const { merch_id } = req.params;
    const { user_id } = req.body;

    try {
        const merch = await prisma.merchandise.findUnique({
            where: {
                merchandise_id: parseInt(merch_id),
            },
        });

        if (!merch) {
            return res.status(404).json({ message: 'Merchandise not found' });
        }

        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.toco.org/">
                <soapenv:Header/>
                <soapenv:Body>
                    <ser:createTransaction>
                        <user_id>${user_id}</user_id>
                        <amount>${merch.price}</amount>
                        <type>buy merch</type>
                    </ser:createTransaction>
                </soapenv:Body>
            </soapenv:Envelope>
        `;
        const headers = {
            'Content-Type': 'text/xml',
            'SOAPAction': 'createTransaction',
            'X-api-key': 'toco_rest',
        };

        const soapResponse = await fetch('http://localhost:8080/service/transaction', {
            method: 'POST',
            headers: headers,
            body: soapRequest,
        });

        const soapXml = await soapResponse.text();

        const startTag = '<return>';
        const endTag = '</return>';
        const startIndex = soapXml.indexOf(startTag);
        const endIndex = soapXml.indexOf(endTag);

        if (startIndex !== -1 && endIndex !== -1) {
            const returnValue = soapXml.substring(startIndex + startTag.length, endIndex);

            if (returnValue === 'success') {
                return res.json({ message: 'Transaction successful' });
            } else if (returnValue === 'insufficient gems') {
                return res.status(400).json({ message: 'Transaction failed, insufficient gems' });
            } else {
                return res.status(500).json({ message: 'Transaction failed' });
            }
        } else {
            return res.status(500).json({ message: 'Error parsing SOAP response' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while processing the purchase',
        });
    }
});


export default router;