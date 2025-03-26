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
  tokenId: string;
};

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
  },
  email: {
    type: 'string',
    unique: true,
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
  languageCode: {
    type: 'number',
  },
  tokenId: {
    type: 'string',
    unique: true,
  },
});

export default mongoose.model('User', UserSchema);
