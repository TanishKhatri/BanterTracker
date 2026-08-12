import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { populateConversationWithUnreadCount } from "../utils/helper.js";

// registers a socket for marking messages as read
const registerMarkReadSocket = (io, socket) => {
  socket.on('markRead', async ({ messageId }) => {
    // Takes the messageId
    try {
      // Find the message in DB or error
      const givenMessage = await Message.findById(messageId);
      if (!givenMessage) {
        return socket.emit('error', { error: 'Provided message id does not exist' });
      }

      // Find the conversation the message is a part of or error
      const messageSender = givenMessage.sender;
      const givenConversation = await Conversation.findById(givenMessage.conversation);
      if (!givenConversation) {
        return socket.emit('error', { error: 'Message doesnt belong to any conversation' });
      }

      // Find the socketUser on the conversation participants array or error
      const providedUser = givenConversation.participants.find((p) => p.userId.toString() === socket.user.id);
      if (!providedUser) {
        return socket.emit('error', { error: 'Participants doesnt contain user' });
      }

      // Update their lastMessageRead to the messageId provided by them
      providedUser.lastMessageRead = givenMessage._id;
      await givenConversation.save();

      // Populates every document in the conversation object along with adding unreadCount
      const populatedConversationObject = await populateConversationWithUnreadCount(givenConversation._id);

      populatedConversationObject.participants.forEach((p) => {
        io.to(p.userId.id.toString()).emit('markedRead', { conversation: populatedConversationObject })
      })
    } catch(error) {
      socket.emit('error', { error: error.message });
    }
  })
}

export default registerMarkReadSocket;