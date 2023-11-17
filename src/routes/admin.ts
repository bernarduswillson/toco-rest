import express from 'express';
import bcrypt from 'bcrypt';
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

// Search admin
router.get('/search', accessValidation, async (req, res) => {
  const { q } = req.query;

  let whereCondition = {}

  if (q) {
    whereCondition = {
      OR: [
        {
          username: {
            contains: String(q) || '', 
            mode: 'insensitive', 
          },
        },
        {
          email: {
            contains: String(q) || '', 
            mode: 'insensitive', 
          },
        },
      ],
    };
    console.log(q);
  }

  console.log('hai');

  try {
      const result = await prisma.admin.findMany({
        where: whereCondition,
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
        },
      });

      res.json({
          message: 'Admin retrieved successfully',
          result,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'An error occurred while retrieving the admin',
      });
  }
});

// Create admin
router.post('/create', accessValidation, async (req, res) => {
  const { username, email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
      await prisma.admin.create({
          data: {
              username,
              email,
              password: hashedPassword,
          }
      });
      
      return res.status(200).json({
          message: 'Admin successfully created'
      });
  } catch (error) {
      return res.status(500).json({
          message: 'An error occurred while creating admin'
      });
  }
});

// Update admin
router.put('/edit/:id', accessValidation, async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.admin.update({
      where: {
        admin_id: parseInt(id)
      }, data: {
        username,
        email,
        password: hashedPassword
      }
    });

    return res.status(200).json({
      message: 'Admin edited created'
  });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred while updating admin'
    });
  }
});

// Delete admin
router.delete('/delete/:id', accessValidation, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.admin.delete({
      where: {
        admin_id: parseInt(id)
      }
    });

    return res.status(200).json({
      message: 'Admin deleted created'
  });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred while deleting admin'
    });
  }
});

export default router;
