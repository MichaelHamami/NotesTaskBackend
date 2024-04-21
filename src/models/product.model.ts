import { Schema, model } from 'mongoose';

export enum UnitType {
  LB = 1,
  PKG = 2,
  OZ = 3,
  gal = 4,
}

const product = new Schema({
  name: {
    type: String,
    required: true,
  },
  unit_type: {
    type: Number,
    enum: Object.values(UnitType),
  },
  quantity: {
    type: Number,
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
    type: Number,
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
    type: String,
  },
  description: String,
  bought: {
    type: Boolean,
    default: false,
  },
  price: Number,
  image: String,
});

export default model('Product', product);
