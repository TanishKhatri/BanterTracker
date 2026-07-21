import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

const app = express();

//Connect to MongoDB
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('Mongo db connected');
  })
  .catch(() => {
    logger.error('Mongo db failed to connect');
  });

//Parse incoming JSON into req.body
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

export default app;
