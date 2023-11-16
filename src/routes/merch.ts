import express from 'express';
import path from 'path';
import multer from 'multer';
import shortid from 'shortid';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, '../images');
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${shortid.generate()}-${file.originalname}`
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage });

// Create merch
router.post('/create', accessValidation, upload.single('image'), async (req, res) => {
    const { name, price, desc } = req.body;

    try {
        const result = await prisma.merchandise.create({
            data: {
                name,
                price: parseInt(price),
                image: req.file?.path,
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

// Update merch
router.put('/edit/:id', accessValidation, async (req, res) => {
    const { id } = req.params;
    const { name, price, image, desc } = req.body;

    try {
        const result = await prisma.merchandise.update({
            where: {
                merchandise_id: parseInt(id),
            },
            data: {
                name,
                price,
                image,
                desc,
            }
        });

        res.json({
            message: 'Merch updated successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating the merch',
        });
    }
})

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

// Get merch by id
router.get('/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const result = await prisma.merchandise.findUnique({
            where: {
                merchandise_id: parseInt(id),
            }
        });

        if (result) {
            res.json({
                message: 'Merch retrieved successfully',
                result
            });
        } else {
            res.status(404).json({
                message: 'Merch not found',
                result
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the merch',
        });
    }
})

// try buying merch (validate to SOAP)
router.post('/buy/:merch_id', async (req, res) => {
    const { merch_id } = req.params;
    const { user_id, email } = req.body;

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
                        <email>${email}</email>
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
                return res.json({ message: returnValue });
            } else if (returnValue === 'insufficient gems') {
                return res.status(400).json({ message: returnValue });
            } else {
                return res.status(500).json({ message: returnValue });
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

router.delete('/delete/:id', accessValidation, async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await prisma.merchandise.delete({
            where: {
                merchandise_id: parseInt(id),
            },
        })

        res.json({
            message: 'Merchandise deleted successfully',
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while deleting the merchandise',
        });
    }
});

router.get('/validate/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const merchandise = await prisma.merchandise.findUnique({
            where: {
                merchandise_id: parseInt(id),
            },
            select: {
                merchandise_id: true,
            },
        });

        const isValid = merchandise !== null;

        res.json({
            message: 'Merchandise id validated successfully',
            result: isValid,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while validating the merchandise id',
        });
    }
});

export default router;