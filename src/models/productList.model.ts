import { Schema, model } from 'mongoose';
import { ProductModel } from './product.model';

export type ProductListModel = {
  name?: string;
  items?: string[] | ProductModel[];
  type?: number;
};

export enum ProductListType {
  SHOPPING = 0,
  HOME = 1,
}

const productListTypeValues = Object.values(ProductListType);
const productList = new Schema({
  name: {
    type: 'string',
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  type: {
    type: 'number',
    default: ProductListType.SHOPPING,
    validate: {
      validator: function (value) {
        return productListTypeValues.includes(value);
      },
      message: (props) => `${props.value} is not a valid type value`,
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model('ProductList', productList);
