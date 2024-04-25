import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: {
    type: 'string',
    required: true,
  },
});

export default mongoose.model('Note', noteSchema);
