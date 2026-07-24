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

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' });
  next();
};

export default { requestLogger, tokenExtractor, userExtractor, unknownEndpoint };
