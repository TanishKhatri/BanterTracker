import mongoose from "mongoose";
import User from "../models/user.js";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import { populateConversationWithUnreadCount } from "../utils/helper.js";

/* 
  Future plans: 
  - Potentially switch receiverId into an array of receivers and then make a group based on that
    instead of separately making a group with a GET as I am doing right now.
    will require message to be empty in the group case
*/

// Registers functionality for sending and receiving messages in the backend
const registerChatSocket = (io, socket) => {
  socket.on('sendMessage', async ({ message, convoId, receiverId }) => {
    // if message is null/undefined then error
    if (!(message) ) {
      return socket.emit('error', { error: 'message is not specified' });
    }

    // Either have the convoId or the receiverId not both
    if (!((convoId && !receiverId) || (!convoId && receiverId))) {
      return socket.emit('error', { error: 'Specify only convoId or receiverId' });
    }

    if (convoId) {
      // Start a session for atomicity
      const session = await mongoose.startSession();
      try {
        //Find the conversation otherwise error
        const conversation = await Conversation.findById(convoId);
        if (!conversation) {
          return socket.emit('error', { error: 'conversation doesnt exist' });
        }

        //Check if user is part of the conversation otherwise error
        if (!conversation.participants.some((p) => p.userId.toString() === socket.user.id)) {
          return socket.emit('error', { error: 'socket is not a participant of this conversation' });
        }

        // Declare variables for use after the transaction
        let savedConversation = null;
        let savedMessage = null;
        await session.withTransaction(async () => {
          // Save the new message with the specified id and userId
          const newMessage = new Message({
            conversation: conversation._id,
            sender: socket.user.id,
            content: message
          });
          savedMessage = await newMessage.save({ session });
          
          // Save the message on the conversation side as the lastMessage,
          // Also mark this message as read for the user who sent it
          conversation.lastMessage = savedMessage._id;
          conversation.participants.forEach((p) => {
            if (p.userId.toString() === socket.user.id) {
              p.lastMessageRead = savedMessage._id;
            }
          })
          savedConversation = await conversation.save({ session });
        })

        //Populates any conversationId with the userId, lastMessageRead, lastMessage and unreadCount
        const populatedConversationObject = await populateConversationWithUnreadCount(savedConversation._id);
        // Send it to every participant of the conversation
        savedConversation.participants.forEach((p) => {
          io.to(p.userId.toString()).emit('receiveMessage', { receivingConversation: populatedConversationObject }) 
        });
      } catch(error) {
        return socket.emit('error', { error: error.message });
      } finally {
        await session.endSession();
      }
    } else if (receiverId) {
      // Start Session
      const session = await mongoose.startSession();
      try {
        // Find receiver or error
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          return socket.emit('error', { error: 'receiver not found' });
        }
        // Make a new conversation between these 2 people
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

        //Declare for use below
        let savedConversation = null;
        let savedMessage = null;
        await session.withTransaction(async () => {
          //Save the conversation just made
          savedConversation = await conversation.save({ session });
          
          // Make a message and save with socketUser and conversationId
          const newMessage = new Message({
            conversation: savedConversation._id,
            sender: socket.user.id,
            content: message
          });
          savedMessage = await newMessage.save({ session });

          // Save the message into the conversation as the last message
          // Additionally markRead for the sender of the message.
          conversation.lastMessage = savedMessage._id;
          conversation.participants.forEach((p) => {
            if (p.userId.toString() === socket.user.id) {
              p.lastMessageRead = savedMessage._id;
            }
          })
          savedConversation = await conversation.save({ session });
        });

        //Populates any conversationId with the userId, lastMessageRead, lastMessage and unreadCount
        const populatedConversationObject = await populateConversationWithUnreadCount(savedConversation._id);
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