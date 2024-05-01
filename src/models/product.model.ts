import { Schema, model } from 'mongoose';
import { OTHER_CATEGORY_ID } from './category.model';

export enum UnitType {
  LB = 1,
  PKG = 2,
  OZ = 3,
  gal = 4,
}

const productUnitTypeValue = Object.values(UnitType);

export type ProductModel = {
  name: string;
  unit_type: keyof UnitType;
  quantity: number;
  current_quantity: number;
  category: string;
  description: string;
  bought: boolean;
  price: number;
  image: string;
};

const product = new Schema({
  name: {
    type: 'string',
    required: true,
  },
  unit_type: {
    type: 'number',
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
        // Check if the value is an integer
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
        // Check if the value is an integer
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
  price: 'number',
  image: 'string',
});

export default model('Product', product);
