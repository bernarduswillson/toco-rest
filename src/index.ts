import express from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

const app = express();
const cors = require('cors');
app.use(cors());
const PORT = 5000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running in PORT: ${PORT}`);
});
