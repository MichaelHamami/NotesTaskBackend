import { ApplicationError } from '../middlewares/errorHandler';
import ProductList, { ProductListModel } from '../models/productList.model';

class ProductListController {
  async deleteProductList(id: string) {
    const deletedProductList = await ProductList.findByIdAndDelete(id);
    if (!deletedProductList) {
      throw new Error('ProductList not found');
    }
    return deletedProductList;
  }

  async createProductList(name: string) {
    const productList = new ProductList({ name });
    const savedProductList = await productList.save();
    return savedProductList;
  }

  async updateProductList(id: string, data: Partial<ProductListModel>) {
    const savedProductList = await ProductList.findByIdAndUpdate(id, { data }, { new: true });
    if (!savedProductList) {
      throw new Error('ProductList not found');
    }
    console.log('asdasd');
    return savedProductList;
  }

  async getProductList(id: string) {
    const productList = await ProductList.findOne({ _id: id }).populate('items');
    if (!productList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
    return productList;
  }

  async getProductLists() {
    const productLists = await ProductList.find().populate('items');
    return productLists;
  }
}
export default ProductListController;
