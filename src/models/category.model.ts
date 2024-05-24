import { Schema, model } from 'mongoose';

export const OTHER_CATEGORY_ID = '663146e3104405840ad156be';

export type CategoryModel = {
  name: string;
  image: string;
  isSystem: boolean;
  color: string;
};

const categorySchema = new Schema({
  name: {
    type: 'string',
    required: true,
  },
  isSystem: {
    type: 'boolean',
    default: false,
  },
  color: {
    type: 'string',
    default: '#000000',
  },
  image: {
    type: 'string',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default model('Category', categorySchema);
