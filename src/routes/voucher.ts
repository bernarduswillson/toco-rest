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
router.put('/delete/:id', accessValidation, async (req, res) => {
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

export default router;
