import { Schema, model } from 'mongoose';
import Product from './product.model';

export type ProductListModel = {
  name?: string;
  items?: string[];
};

const productList = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: Product,
    },
  ],
});

export default model('ProductList', productList);
