import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Message from '../models/message.js';
import middleware from '../utils/middleware.js';
import Conversation from '../models/conversation.js';

const conversationRouter = express.Router();

conversationRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'No token specified' });
  }

  const newConvo = new Conversation({
    title: body.title,
    participants: body.participants
  });

  const savedConvo = await newConvo.save();
  return res.status(201).send(savedConvo);
});

conversationRouter.get('/', middleware.userExtractor, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'No token specified' });
  }

  const conversations = await Conversation.find({ participants: user._id })
    .populate('participants')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
      },
    });
  res.status(200).send({ conversations });
});

export default conversationRouter;
