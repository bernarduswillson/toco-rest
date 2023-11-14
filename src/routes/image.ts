import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
    const { filename } = req.query;

    if (!filename) {
        return res.status(400).send('Filename is required');
    }

    const filePath = path.join(__dirname, `../images/${filename}`);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
});

export default router;
