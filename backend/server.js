const express = require('express');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(requestLogger);
app.use('/user', userRoutes);
app.use(errorLogger);

app.listen(8000, () => {
  console.log('App is running on port 8000');
});