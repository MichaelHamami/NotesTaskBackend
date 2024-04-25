import { Schema, model } from 'mongoose';

const toObjectIdStringPlugin = function (schema) {
  schema.set('toJSON', {
    transform: function (doc, ret) {
      if (ret._id) {
        ret._id = ret._id.toString();
      }
    },
  });
};

const taskSchema = new Schema({
  title: {
    type: 'string',
    required: true,
  },
  description: 'string',
  isCompleted: {
    type: Boolean,
    default: false,
  },
  type: 'string',
  endDate: Date,
  circulationTime: {
    type: Number,
    default: 0,
  },
});

taskSchema.plugin(toObjectIdStringPlugin);

export default model('Task', taskSchema);
