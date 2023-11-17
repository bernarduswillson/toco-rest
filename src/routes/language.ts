import express from 'express';
import accessValidation from '../middleware/accessValidation';

const router = express.Router();

// Get all languages from php endpoint
router.get('/', accessValidation, async (req, res) => {
    try {
        const response = await fetch('http://localhost:8008/api/endpoint/language.php');

        if (!response.ok) {
            res.status(response.status).json({ error: 'Failed to fetch data' });
            return;
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'An error occurred while fetching data'
        });
    }
});

export default router;



