import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import usersRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import conversationRouter from './controllers/conversations.js';
import config from './utils/config.js';
import logger from './utils/logger.js';
import middleware from './utils/middleware.js';
import { Server } from 'socket.io';
import registerSockets from './sockets/index.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});
io.use(middleware.authenticateSocket);
registerSockets(io);

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust this path if your dist folder is elsewhere
const distPath = path.resolve(__dirname, './dist');
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

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/conversations', conversationRouter);

// Serve frontend
app.use(express.static(distPath));

// SPA fallback
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default server;
