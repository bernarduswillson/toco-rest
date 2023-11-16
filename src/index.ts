import express from 'express';
import imageRoutes from './routes/image';
import authRoutes from './routes/auth';
import exerciseRoutes from './routes/exercise';
import languageRoutes from './routes/language';
import questionRoutes from './routes/question'
import optionRoutes from './routes/option'
import progressRoutes from './routes/progress'
import merchRoutes from './routes/merch'
import adminRoutes from './routes/admin'
const cookieParser = require('cookie-parser');

const app = express();
const cors = require('cors');
app.use(cors());
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/image', imageRoutes);
app.use('/auth', authRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/language', languageRoutes);
app.use('/question', questionRoutes);
app.use('/option', optionRoutes);
app.use('/progress', progressRoutes);
app.use('/merch', merchRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running in PORT: ${PORT}`);
});
