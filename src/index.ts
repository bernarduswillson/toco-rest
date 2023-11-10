import express from 'express';
import authRoutes from './routes/auth';
import exerciseRoutes from './routes/exercise';
import languageRoutes from './routes/language';
import questionRoutes from './routes/question'
import optionRoutes from './routes/option'

const app = express();
const cors = require('cors');
app.use(cors());
const PORT = 5000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/language', languageRoutes);
app.use('/question', questionRoutes);
app.use('/option', optionRoutes);

app.listen(PORT, () => {
  console.log(`Server running in PORT: ${PORT}`);
});
