import mongoose from 'mongoose';
import config from './config.js';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import Conversation from '../models/conversation.js';
import Message from '../models/message.js';

mongoose.connect(config.MONGODB_URI, { family: 4 }).then(async () => {
  console.log('DB connected');
  await Promise.all([User.deleteMany({}), Conversation.deleteMany({}), Message.deleteMany({})]);

  const users = [
    {
      username: 'alexj',
      name: 'Alex Johnson',
      password: 'Pass1234!',
    },
    {
      username: 'sarahm',
      name: 'Sarah Miller',
      password: 'Secure567!',
    },
    {
      username: 'davidl',
      name: 'David Lee',
      password: 'Welcome89#',
    },
    {
      username: 'emilyr',
      name: 'Emily Roberts',
      password: 'Sunshine42$',
    },
    {
      username: 'michaelb',
      name: 'Michael Brown',
      password: 'Rocket88@',
    },
    {
      username: 'oliviat',
      name: 'Olivia Taylor',
      password: 'Ocean2024!',
    },
    {
      username: 'danielw',
      name: 'Daniel Wilson',
      password: 'Tiger55%',
    },
    {
      username: 'sophiac',
      name: 'Sophia Clark',
      password: 'MapleTree9!',
    },
    {
      username: 'jamesh',
      name: 'James Harris',
      password: 'CodeMaster7#',
    },
    {
      username: 'gracea',
      name: 'Grace Anderson',
      password: 'BrightSky11!',
    },
  ];

  const userPromises = users.map(async (u) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(u.password, saltRounds);
    const newUser = new User({
      username: u.username,
      name: u.name,
      passwordHash,
    });
    return newUser.save();
  });

  await Promise.all(userPromises);

  const userData = await User.find({});
  const conversations = [
    {
      participants: [userData[0]._id, userData[1]._id, userData[2]._id],
    },
    {
      participants: [userData[3]._id, userData[4]._id],
    },
    {
      participants: [userData[5]._id, userData[6]._id, userData[7]._id, userData[8]._id],
    },
    {
      participants: [userData[9]._id, userData[0]._id],
    },
    {
      participants: [
        userData[1]._id,
        userData[3]._id,
        userData[5]._id,
        userData[7]._id,
        userData[9]._id,
      ],
    },
    {
      participants: [userData[2]._id, userData[4]._id, userData[6]._id],
    },
    {
      participants: [
        userData[8]._id,
        userData[9]._id,
        userData[1]._id,
        userData[4]._id,
        userData[7]._id,
        userData[0]._id,
      ],
    },
    {
      participants: [userData[5]._id, userData[2]._id],
    },
    {
      participants: [userData[6]._id, userData[8]._id, userData[3]._id, userData[0]._id],
    },
    {
      participants: [
        userData[0]._id,
        userData[2]._id,
        userData[4]._id,
        userData[6]._id,
        userData[8]._id,
        userData[9]._id,
        userData[1]._id,
      ],
    },
  ];
  await Conversation.insertMany(conversations);

  const convoData = await Conversation.find({});
  const messages = [
    {
      conversation: convoData[0]._id,
      sender: userData[0]._id,
      content: 'Hey everyone! Hope you are all doing well.',
      delivered: true,
      read: false,
    },
    {
      conversation: convoData[1]._id,
      sender: userData[3]._id,
      content: 'I will be there in about 15 minutes.',
      delivered: true,
      read: true,
    },
    {
      conversation: convoData[2]._id,
      sender: userData[5]._id,
      content: 'Can someone review my latest changes?',
      delivered: true,
      read: false,
    },
    {
      conversation: convoData[3]._id,
      sender: userData[9]._id,
      content: 'Sounds good to me!',
      delivered: true,
      read: true,
    },
    {
      conversation: convoData[4]._id,
      sender: userData[1]._id,
      content: 'Let’s schedule a meeting for tomorrow morning.',
      delivered: true,
      read: false,
    },
    {
      conversation: convoData[5]._id,
      sender: userData[4]._id,
      content: 'Thanks for the quick update.',
      delivered: true,
      read: true,
    },
    {
      conversation: convoData[6]._id,
      sender: userData[7]._id,
      content: 'I have pushed the fixes to the repository.',
      delivered: true,
      read: false,
    },
    {
      conversation: convoData[7]._id,
      sender: userData[2]._id,
      content: 'Could you send me the document when you have time?',
      delivered: true,
      read: true,
    },
    {
      conversation: convoData[8]._id,
      sender: userData[6]._id,
      content: 'Happy birthday! 🎉 Have an amazing day!',
      delivered: true,
      read: false,
    },
    {
      conversation: convoData[9]._id,
      sender: userData[8]._id,
      content: 'See you all at the event this weekend.',
      delivered: true,
      read: true,
    },
  ];

  for (const m of messages) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const newMessage = new Message(m);
        const savedMessage = await newMessage.save({ session });
        await Conversation.findByIdAndUpdate(
          savedMessage.conversation,
          { lastMessage: savedMessage._id },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }
  }

  mongoose.disconnect();
});
