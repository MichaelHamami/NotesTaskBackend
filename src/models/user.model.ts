import mongoose from 'mongoose';

export type UserSession = {
  userId: string;
  name?: string;
  email?: string;
  languageCode?: number;
};

export type UserModel = {
  name: string;
  email: string;
  languageCode: number;
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
    required: true,
  },
  username: {
    type: 'string',
    required: true,
    unique: true,
  },
  fingerPrint: {
    type: 'string',
  },
  languageCode: {
    type: 'number',
  },
});

export default mongoose.model('User', UserSchema);
