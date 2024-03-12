import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  fingerPrint: {
    type: String,
    requred: true,
  },
});

export default mongoose.model('User', UserSchema);
