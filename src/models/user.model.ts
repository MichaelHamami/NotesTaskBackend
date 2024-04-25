import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
  },
  fingerPrint: {
    type: 'string',
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
