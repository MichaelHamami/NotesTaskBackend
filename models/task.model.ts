import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  type: String,
  endDate: Date,
  circulationTime: {
    type: Number,
    default: 0,
  },
});

export default model('Task', taskSchema);
