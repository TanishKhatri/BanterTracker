import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Message from '../models/message.js';
import middleware from '../utils/middleware.js'
import Conversation from '../models/conversation.js';

const conversationRouter = express.Router();

conversationRouter.get('/', middleware.userExtractor, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'No token specified' });
  }

  const conversations = await Conversation.find({ participants: user._id }).populate('participants').populate('lastMessage');
  res.status(200).send({ conversations });
});

export default conversationRouter;