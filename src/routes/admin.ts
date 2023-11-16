import express from 'express';
import accessValidation from '../middleware/accessValidation';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all admins
router.get('/', accessValidation, async (req, res) => {
  try {
      const result = await prisma.admin.findMany({
          select: {
              admin_id: true,
              username: true,
              email: true,
              password: false,
          },
      });

      res.json({
          message: 'Admins retrieved successfully',
          result,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'An error occurred while retrieving the exercises',
      });
  }
});

// Get admin by id
router.get('/:id', accessValidation, async (req, res) => {
  const { id } = req.params;
  
  try {
      const result = await prisma.admin.findUnique({
        where: {
          admin_id: parseInt(id),
        },
        select: {
          admin_id: true,
          username: true,
          email: true,
          password: false,
        },
      });

      res.json({
          message: 'Admins retrieved successfully',
          result,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'An error occurred while retrieving the exercises',
      });
  }
});

export default router;
