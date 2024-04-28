import { ApplicationError } from '../middlewares/errorHandler';
import ProductList, { ProductListModel } from '../models/productList.model';

class ProductListController {
  async deleteProductList(id: string) {
    const deletedProductList = await ProductList.findByIdAndDelete(id);
    if (!deletedProductList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
    return deletedProductList;
  }

  async createProductList(name: string, type: number) {
    const productList = new ProductList({ name, type });
    const savedProductList = await productList.save();
    return savedProductList;
  }

  async updateProductList(id: string, data: Partial<ProductListModel>) {
    const savedProductList = await ProductList.findByIdAndUpdate(id, { name: data.name, items: data.items, type: data.type }, { new: true });
    if (!savedProductList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
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
