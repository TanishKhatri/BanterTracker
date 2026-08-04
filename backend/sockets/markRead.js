import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

const registerMarkReadSocket = (socket) => {
  socket.on('markRead', async ({ messageId }) => {
    try {
      const givenMessage = await Message.findById(messageId);
      if (!givenMessage) {
        return socket.emit('error', { error: 'Provided message id does not exist' });
      }

      const messageSender = givenMessage.sender;
      const givenConversation = await Conversation.findById(givenMessage.conversation);
      if (!givenConversation) {
        return socket.emit('error', { error: 'Message doesnt belong to any conversation' });
      }

      const providedUser = givenConversation.participants.find((p) => p.userId.toString() === socket.user.id);
      if (!providedUser) {
        return socket.emit('error', { error: 'Participants doesnt contain user' });
      }
      providedUser.lastMessageRead = givenMessage._id;
      await givenConversation.save();

      const populatedConversation = await Conversation.findById(givenConversation._id)
        .populate('participants.userId')
        .populate('participants.lastMessageRead')
        .populate({
          path: 'lastMessage',
          populate: {
            path: 'sender',
          },
        });

      const populatedConversationObject = populatedConversation.toJSON();

      await Promise.all(
        populatedConversationObject.participants.map(async (participant) => {
          const query = {
            conversation: populatedConversationObject.id,
          };

          // Only filter by lastMessageRead if it exists
          if (participant.lastMessageRead?.id) {
            query._id = { $gt: participant.lastMessageRead.id };
          }

          participant.unreadCount = await Message.countDocuments(query);
        })
      );

      socket.emit('markedRead', { conversation: populatedConversationObject });
    } catch(error) {
      socket.emit('error', { error: error.message });
    }
  })
}

export default registerMarkReadSocket;