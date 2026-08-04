import mongoose from "mongoose";
import User from "../models/user.js";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const registerChatSocket = (io, socket) => {
  socket.on('sendMessage', async ({ message, convoId, receiverId }) => {
    if (!(message) ) {
      return socket.emit('error', { error: 'message is not specified' });
    }

    if (!((convoId && !receiverId) || (!convoId && receiverId))) {
      return socket.emit('error', { error: 'Specify only convoId or receiverId' });
    }

    if (convoId) {
      const session = await mongoose.startSession();
      try {
        const conversation = await Conversation.findById(convoId);
        if (!conversation) {
          return socket.emit('error', { error: 'conversation doesnt exist' });
        }

        if (!conversation.participants.some((p) => p.userId.toString() === socket.user.id)) {
          return socket.emit('error', { error: 'socket is not a participant of this conversation' });
        }

        let savedConversation = null;
        let savedMessage = null;
        await session.withTransaction(async () => {
          const newMessage = new Message({
            conversation: conversation._id,
            sender: socket.user.id,
            content: message
          });
          savedMessage = await newMessage.save({ session });
          conversation.lastMessage = savedMessage._id;
          conversation.participants.forEach((p) => {
            if (p.userId.toString() === socket.user.id) {
              p.lastMessageRead = savedMessage._id;
            }
          })
          savedConversation = await conversation.save({ session });
        })

        const populatedConversation = await Conversation.findById(savedConversation._id)
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
        savedConversation.participants.forEach((p) => {
          io.to(p.userId.toString()).emit('receiveMessage', { receivingConversation: populatedConversationObject }) 
        });
      } catch(error) {
        return socket.emit('error', { error: error.message });
      } finally {
        await session.endSession();
      }
    } else if (receiverId) {
      const session = await mongoose.startSession();
      try {
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          return socket.emit('error', { error: 'receiver not found' });
        }
        const conversation = new Conversation({
          participants: [
            {
              userId: socket.user.id
            }, 
            {
              userId: receiverId
            }
          ]
        });
        let savedConversation = null;
        let savedMessage = null;
        await session.withTransaction(async () => {
          savedConversation = await conversation.save({ session });
          const newMessage = new Message({
            conversation: savedConversation._id,
            sender: socket.user.id,
            content: message
          });
          savedMessage = await newMessage.save({ session });
          conversation.lastMessage = savedMessage._id;
          conversation.participants.forEach((p) => {
            if (p.userId.toString() === socket.user.id) {
              p.lastMessageRead = savedMessage._id;
            }
          })
          savedConversation = await conversation.save({ session });
        });

        const populatedConversation = await Conversation.findById(savedConversation._id)
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
        savedConversation.participants.forEach((p) => {
          io.to(p.userId.toString()).emit('receiveMessage', { receivingConversation: populatedConversationObject }) 
        });
      } catch(error) {
        return socket.emit('error', { error: error.message });
      } finally {
        await session.endSession();
      }
    }
  });
}

export default registerChatSocket;