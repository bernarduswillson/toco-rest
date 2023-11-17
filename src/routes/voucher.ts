import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all voucher
router.get('/', accessValidation, async (req, res) => {
  try {
    const response = await prisma.voucher.findMany({
      select: {
        voucher_id: true,
        code: true,
        amount: true,
      },
    });

    res.status(200).json({
      message: 'Vouchers retrieved successfully',
      result: response
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: 'An error occurred while retrieving vouchers'
    });
  }
});

// Search voucher
router.get('/search', accessValidation, async (req, res) => {
  const { q } = req.query;

  let whereCondition = {}

  if (q) {
    whereCondition = {
      OR: [
        {
          code: {
            contains: String(q) || '', 
            mode: 'insensitive', 
          },
        },
      ],
    };
  } 

  try {
    const response = await prisma.voucher.findMany({
      where: whereCondition,
      select: {
        voucher_id: true,
        code: true,
        amount: true,
    },
    });

    res.status(200).json({
      message: 'Vouchers retrieved successfully',
      result: response
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: 'An error occurred while retrieving vouchers'
    });
  }
});

// Get voucher by id
router.get('/:id', accessValidation, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await prisma.voucher.findUnique({
      where: {
        voucher_id: parseInt(id),
      },
      select: {
        voucher_id: true,
        code: true,
        amount: true,
      },
    });

    res.status(200).json({
      message: 'Voucher retrieved successfully',
      result: response,
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: 'An error occurred while retrieving a voucher'
    });
  }
});

// Validate voucher id 
router.get('/validate/:id', accessValidation, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await prisma.voucher.findUnique({
      where: {
        voucher_id: parseInt(id),
      },
      select: {
        code: true,
        amount: true,
      },
    });

    const isValid = response !== null;

    res.status(200).json({
      message: 'Voucher retrieved successfully',
      result: isValid,
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: 'An error occurred while retrieving a voucher'
    });
  }
});

// Create voucher
router.post('/create', accessValidation, async (req, res) => {
  const { code, amount } = req.body;

  try {
    const response = await prisma.voucher.create({
      data: {
        code,
        amount: parseInt(amount),
      },
    });

    res.status(200).json({
      message: 'Voucher successfully created',
      result: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'An error occurred while creating admin'
    });
  }
});

// Update voucher
router.put('/edit/:id', accessValidation, async (req, res) => {
  const { id } = req.params;
  const { code, amount } = req.body;

  try {
    const response = await prisma.voucher.update({
      where: {
        voucher_id: parseInt(id),
      },
      data: {
        code,
        amount: parseInt(amount),
      },
    });

    res.status(200).json({
      message: 'Voucher successfully updated',
      result: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'An error occurred while updating admin'
    });
  }
});

// Delete voucher 
router.delete('/delete/:id', accessValidation, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await prisma.voucher.delete({
      where: {
        voucher_id: parseInt(id),
      }
    });

    res.status(200).json({
      message: 'Voucher successfully deleted',
      result: response,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'An error occurred while deleting admin',
    });
  }
});

// Find voucher by code, send to SOAP
router.post('/use/:code', accessValidation, async (req, res) => {
  const { code } = req.params;
  const { user_id } = req.body;

  try {
    const response = await prisma.voucher.findUnique({
      where: {
        code: code,
      },
      select: {
        voucher_id: true,
        code: true,
        amount: true,
      },
    });

    const soapRequest = `
        <x:Envelope
            xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:ser="http://service.toco.org/">
            <x:Header/>
            <x:Body>
                <ser:useVoucher>
                    <code>${code}</code>
                    <user_id>${user_id}</user_id>
                    <amount>${response?.amount}</amount>
                    <type>Voucher Redeemed: ${code}</type>
                </ser:useVoucher>
            </x:Body>
        </x:Envelope>
        `;
    const headers = {
      'Content-Type': 'text/xml',
      'SOAPAction': 'useVoucher',
      'X-api-key': 'toco_rest',
    };

    const soapResponse = await fetch('http://localhost:8080/service', {
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
      } else {
        return res.status(500).json({ message: returnValue });
      }
    } else {
      return res.status(500).json({ message: 'Error parsing SOAP response' });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: 'An error occurred while retrieving a voucher'
    });
  }
});

export default router;
