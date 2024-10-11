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

export enum TaskType {
  Normal = 1,
  Circular = 2,
}

export type TaskModel = {
  title: string;
  description: string;
  isCompleted: boolean;
  type: TaskType;
  endDate: Date;
  circulationTime: number;
  note: string;
};

const taskTypeValues = Object.values(TaskType);

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
  type: {
    type: 'number',
    default: TaskType.Normal,
    validate: {
      validator: function (value) {
        return taskTypeValues.includes(value);
      },
      message: (props) => `${props.value} is not a valid type value`,
    },
  },
  endDate: Date,
  circulationTime: {
    type: Number,
    default: 0,
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

taskSchema.plugin(toObjectIdStringPlugin);

export default model('Task', taskSchema);
