import express from 'express';
import User from '../models/user.js';
import Message from '../models/message.js';
import middleware from '../utils/middleware.js';
import Conversation from '../models/conversation.js';

const conversationRouter = express.Router();

//Post a conversation provided user is authenticated
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

//Get all conversations that provided user is a participant of
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

//Get all messages sent by a user
conversationRouter.get('/:convoId/messages', middleware.userExtractor, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'No token specified' });
  }

  const { convoId } = req.params;
  const conversationSearched = await Conversation.findById(convoId); 
  if (!conversationSearched) {
    return res.status(400).json({ error: 'provided conversation does not exist' });
  }

  if (!conversationSearched.participants.includes(user._id)) {
    return res.status(401).json('User does not have the permission to access these messages');
  }

  const messages = await Message.find({ conversation: convoId });
  return res.status(200).send(messages);
});

export default conversationRouter;
