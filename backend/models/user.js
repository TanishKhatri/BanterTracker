import mongoose from 'mongoose';

// Stores the user Info like username, name, password, will store profile photo url in future maybe.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      default: function () {
        return this.username;
      },
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = doc.id;
    
    delete obj._id;
    delete obj.__v;
    delete obj.passwordHash;

    return obj;
  }
});

const User = mongoose.model('User', userSchema);
export default User;
