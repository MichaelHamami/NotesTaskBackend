import mongoose from 'mongoose';

export type UserSession = {
  userId: string;
  name: string;
  email: string;
};

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
  password: {
    type: 'string',
  },
  fingerPrint: {
    type: 'string',
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
