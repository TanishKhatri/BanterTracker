import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

messageSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = doc.id;
    
    delete obj._id;
    delete obj.__v;

    return obj;
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
