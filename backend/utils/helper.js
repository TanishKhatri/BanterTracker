import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

/* 
  Future plans:
  - Maybe populate lastMessageRead's sender field as well for some reason
*/

//Populates any conversationId with the userId, lastMessageRead, lastMessage and unreadCount
const populateConversationWithUnreadCount = async (conversationId) => {
  const populatedConversation = await Conversation.findById(conversationId)
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

  return populatedConversationObject;
}

export { populateConversationWithUnreadCount };