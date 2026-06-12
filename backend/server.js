const express = require('express');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const connectDB = require('./config/connection');
require('dotenv').config();

const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

connectDB();

app.use(cors);
app.use(express.json());
app.use(requestLogger);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use(errorLogger);

app.listen(8000, () => {
  console.log('App is running on port 8000');
});