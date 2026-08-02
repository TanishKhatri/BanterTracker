import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

const registerMarkReadSocket = (socket) => {
  socket.on('markRead', async (messageId) => {
    try {
      const givenMessage = await Message.findById(messageId);
      if (!givenMessage) {
        return socket.emit('error', { error: 'Provided message id does not exist' });
      }

      const messageSender = givenMessage.sender;
      const updatedDate = new Date(givenMessage.updatedAt);
      const givenConversation = await Conversation.findById(givenMessage.conversation);
      if (!givenConversation) {
        return socket.emit('error', { error: 'Message doesnt belong to any conversation' });
      }

      const providedUser = givenConversation.participants.find((p) => p.userId.toString() === socket.user.id);
      if (!providedUser) {
        return socket.emit('error', { error: 'Participants doesnt contain user' });
      }
      providedUser.lastReadAt = updatedDate;
      providedUser.unreadCount++;
      await givenConversation.save();

      socket.emit('markedRead', { conversation: givenConversation })
    } catch(error) {
      socket.emit('error', { error: error.message });
    }
  })
}

export default registerMarkReadSocket;