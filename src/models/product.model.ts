import { Schema, model } from 'mongoose';
import { OTHER_CATEGORY_ID } from './category.model';

export enum UnitType {
  EACH = 1,
  LB = 2,
  PKG = 3,
  OZ = 4,
  gal = 5,
}

const productUnitTypeValue = Object.values(UnitType);

export type ProductModel = {
  name: string;
  unit_type: UnitType;
  quantity: number;
  current_quantity: number;
  category: string;
  description: string;
  bought: boolean;
  price: number;
  image: string;
  isSystem: boolean;
};

const product = new Schema({
  name: {
    type: 'string',
    required: true,
  },
  unit_type: {
    type: 'number',
    default: 1,
    validate: {
      validator: function (value) {
        return productUnitTypeValue.includes(value);
      },
      message: (props) => `${props.value} is not a valid type value`,
    },
  },
  quantity: {
    type: 'number',
    default: 1,
    validate: {
      validator: function (value: number) {
        return Number.isInteger(value) && value > 0;
      },
      message: (props) => `${props.value} is not an integer.`,
    },
  },
  current_quantity: {
    type: 'number',
    default: 0,
    validate: {
      validator: function (value: number) {
        return Number.isInteger(value) && value >= 0;
      },
      message: (props) => `${props.value} is not an integer.`,
    },
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: OTHER_CATEGORY_ID,
  },
  description: 'string',
  bought: {
    type: 'boolean',
    default: false,
  },
  price: { type: 'number', default: 0 },
  image: 'string',
  isSystem: { type: 'boolean', default: false },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default model('Product', product);
