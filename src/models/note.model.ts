import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

export type NoteModel = {
  title: string;
  content: string;
  color: string;
};

const noteSchema = new mongoose.Schema({
  content: {
    type: 'string',
  },
  title: { type: 'string', required: true },
  color: { type: 'string', default: '#000000' },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  modifiedOn: { type: Schema.Types.Date, default: new Date() },
});

export default model('Note', noteSchema);
