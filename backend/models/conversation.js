import mongoose from 'mongoose';

// Each conversation is a mongoObject
// A single group chat and or direct messaging person to person
const conversationSchema = new mongoose.Schema(
  {
    // Store who can participate in this chat
    // Conversation name has not been specified because we will be using the created mongo ID as the room name for the conversation
    // in socket
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      ],
    },

    // For showing the last message in the messages panel where you see all conversations
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 });

conversationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
