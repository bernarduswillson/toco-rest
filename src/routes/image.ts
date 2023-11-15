import express from 'express';
import path from 'path';
import multer from 'multer';
import shortid from 'shortid';
import accessValidation from '../middleware/accessValidation';

const router = express.Router();

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

// Get image
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

// Post image
router.post('/upload', accessValidation, upload.single('image'), (req, res) => {
    console.log("here:");
    console.log(req.file);
    
    res.json({
        message: 'File uploaded successfully'
    });
});

export default router;
