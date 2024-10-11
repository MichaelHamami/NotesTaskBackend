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
  color: {
    type: 'string',
    default: '#9f9b73',
    validate: function (value: string) {
      return /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  modifiedOn: { type: Schema.Types.Date, default: new Date() },
});

export default model('Note', noteSchema);
