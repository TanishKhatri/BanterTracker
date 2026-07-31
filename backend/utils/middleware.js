import jwt from 'jsonwebtoken';
import logger from './logger.js';
import User from '../models/user.js';
import config from './config.js';

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body: ', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (token) {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: 'User is missing or invalid' });
    }

    req.user = user;
  } else {
    req.user = null;
  }

  next();
};

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token provided"));
  } 

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    let user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new Error('User is missing or invalid'));
    }
    user = user.toJSON();
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    res.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'token invalid' });
  } else {
    res.status(500).json({ error: 'Unknown server error' });
  }

  next();
};

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' });
  next();
};

export default { requestLogger, tokenExtractor, userExtractor, errorHandler, authenticateSocket, unknownEndpoint };
