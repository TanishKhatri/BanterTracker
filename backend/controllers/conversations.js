import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.js';
import Message from '../models/message.js';
import middleware from '../utils/middleware.js';
import Conversation from '../models/conversation.js';

const conversationRouter = express.Router();

//User Extracter middleware is for putting the raw user object from DB into req.user

//Post a conversation provided user is authenticated
//For group chats

// Do not use for posting 1 on 1 conversations
conversationRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body;
  const user = req.user;
  if (!user) {
    // authenticate
    return res.status(401).json({ error: 'No token specified' });
  }

  if (body.participants.length <= 2) {
    return res.status(400).json({ error: 'This route is for group chats only' });
  }

  const newConvo = new Conversation({
    title: body.title,
    participants: body.participants,
  });

  const savedConvo = await newConvo.save();
  return res.status(201).send(savedConvo);
});

//Get all conversations that a user is the participant of
//For loading chats on the sidebar
conversationRouter.get('/', middleware.userExtractor, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'No token specified' });
  }

  const conversations = await Conversation.find({ 'participants.userId': user._id })
    .populate('participants.userId')
    .populate('participants.lastMessageRead')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
      },
    });

  const conversationsObject = conversations.map((c) => c.toJSON());

  await Promise.all(
    conversationsObject.map(async (conversation) => {
      await Promise.all(
        conversation.participants.map(async (participant) => {
          const query = {
            conversation: conversation.id,
          };

          // Only filter by lastMessageRead if it exists
          if (participant.lastMessageRead?.id) {
            query._id = { $gt: participant.lastMessageRead.id };
          }

          participant.unreadCount = await Message.countDocuments(query);
        })
      );
    })
  );

  res.status(200).send({ conversations: conversationsObject });
});


const MESSAGE_AMOUNT = 50;
//Get 50 messages based on a user's query of the lastMessage the user can see
//If no query is specified we send the latest 50 messages
conversationRouter.get('/:convoId/messages', middleware.userExtractor, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'No token specified' });
  }

  const { convoId } = req.params;
  const { beforeCreatedAt, beforeId } = req.query;

  const conversationSearched = await Conversation.findById(convoId);
  if (!conversationSearched) {
    return res.status(400).json({ error: 'provided conversation does not exist' });
  }

  if (!conversationSearched.participants.some((p) => p.userId.equals(user._id))) {
    return res.status(401).json('User does not have the permission to access these messages');
  }

  const match = {
    conversation: new mongoose.Types.ObjectId(convoId)
  }

  if (beforeCreatedAt && beforeId) {
    const beforeCreatedAtDate = new Date(beforeCreatedAt);
    if (isNaN(beforeCreatedAtDate)) {
      return res.status(400).json({ error: 'createdAt is malformed'});
    }

    if (!mongoose.isValidObjectId(beforeId)) {
      return res.status(400).json({
        error: 'id is malformed'
      });
    } 

    match.$or = [
      { createdAt: { $lt: beforeCreatedAt } },
      {
        createdAt: beforeCreatedAt,
        _id: { $lt: new mongoose.Types.ObjectId(beforeId) }
      }
    ]
  }

  const messages = await Message.aggregate([
    {
      $match: match
    },
    {
      $sort: {
        createdAt: -1,
        _id: -1
      }
    },
    {
      $limit: MESSAGE_AMOUNT,
    }, 
    {
      $sort: {
        createdAt: 1,
        _id: 1
      }
    }
  ])

  const messageDocuments = messages.map((message) =>
    Message.hydrate(message)
  );

  await Message.populate(messageDocuments, {
    path: 'sender'
  })

  const oldest = messageDocuments[0];

  return res.status(200).json({
    messages: messageDocuments,
    nextCursor: oldest ? { createdAt: oldest.createdAt, id: oldest._id } : null
  });
});

export default conversationRouter;
