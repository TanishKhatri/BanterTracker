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

  const userData = await Promise.all(userPromises);
  const conversations = [
    {
      title: 'Project Team',
      participants: [
        { userId: userData[0]._id },
        { userId: userData[1]._id },
        { userId: userData[2]._id },
      ],
    },
    {
      participants: [
        { userId: userData[3]._id },
        { userId: userData[4]._id },
      ],
    },
    {
      title: 'Development Squad',
      participants: [
        { userId: userData[5]._id },
        { userId: userData[6]._id },
        { userId: userData[7]._id },
        { userId: userData[8]._id },
      ],
    },
    {
      participants: [
        { userId: userData[9]._id },
        { userId: userData[0]._id },
      ],
    },
    {
      title: 'Leadership Group',
      participants: [
        { userId: userData[1]._id },
        { userId: userData[3]._id },
        { userId: userData[5]._id },
        { userId: userData[7]._id },
        { userId: userData[9]._id },
      ],
    },
    {
      title: 'Study Group',
      participants: [
        { userId: userData[2]._id },
        { userId: userData[4]._id },
        { userId: userData[6]._id },
      ],
    },
    {
      title: 'Weekend Crew',
      participants: [
        { userId: userData[8]._id },
        { userId: userData[9]._id },
        { userId: userData[1]._id },
        { userId: userData[4]._id },
        { userId: userData[7]._id },
        { userId: userData[0]._id },
      ],
    },
    {
      participants: [
        { userId: userData[5]._id },
        { userId: userData[2]._id },
      ],
    },
    {
      title: 'Gaming Party',
      participants: [
        { userId: userData[6]._id },
        { userId: userData[8]._id },
        { userId: userData[3]._id },
        { userId: userData[0]._id },
      ],
    },
    {
      title: 'All Hands',
      participants: [
        { userId: userData[0]._id },
        { userId: userData[2]._id },
        { userId: userData[4]._id },
        { userId: userData[6]._id },
        { userId: userData[8]._id },
        { userId: userData[9]._id },
        { userId: userData[1]._id },
      ],
    },
  ];
  await Conversation.insertMany(conversations);

  const randomParticipant = (conversation) => {
    return conversation.participants[Math.floor(Math.random() * conversation.participants.length)].userId;
  };

  const convoData = await Conversation.find({});
  const sampleMessages = [
    'Hey everyone! Hope you are all doing well.',
    'I will be there in about 15 minutes.',
    'Can someone review my latest changes?',
    'Sounds good to me!',
    'Let’s schedule a meeting for tomorrow morning.',
    'Thanks for the quick update.',
    'I have pushed the fixes to the repository.',
    'Could you send me the document when you have time?',
    'Happy birthday! 🎉 Have an amazing day!',
    'See you all at the event this weekend.',
    'I am working on the bug fix now.',
    'Can we move the meeting to the afternoon?',
    'Looks great to me!',
    'I just merged the pull request.',
    'Please check your email.',
    'I will send the report shortly.',
    'Anyone available for a quick call?',
    'Thanks for your help!',
    'That issue has been resolved.',
    'Let me know if you have any questions.',
  ];

  const messages = Array.from({ length: 1000 }, (_, i) => {
    const conversation = convoData[i % convoData.length];

    return {
      conversation: conversation._id,
      sender: randomParticipant(conversation),
      content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
    };
  });

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
