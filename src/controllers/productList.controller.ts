import { ApplicationError } from '../middlewares/errorHandler';
import { ProductModel } from '../models/product.model';
import ProductList, { ProductListModel } from '../models/productList.model';
import ProductController from './product.controller';

class ProductListController {
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
  }

  async newItemToProductList(id: string, data: Partial<ProductModel>) {
    const product = await this.productController.createProduct(data);
    if (!product) throw new ApplicationError(400, 'Product invalid data');
    const productList = await this.getProductList(id);
    const newItems = [product._id.toString(), ...productList.items.map((item) => item._id.toString())];
    return await this.updateProductList(id, { items: newItems });
  }

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
    const savedProductList = await ProductList.findByIdAndUpdate(id, { name: data.name, items: data.items, type: data.type }, { new: true }).populate(
      { path: 'items', populate: { path: 'category' } }
    );
    if (!savedProductList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
    return savedProductList;
  }

  async getProductList(id: string) {
    const productList = await ProductList.findOne({ _id: id }).populate({ path: 'items', populate: { path: 'category' } });
    if (!productList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
    return productList;
  }

  async getProductLists() {
    const productLists = await ProductList.find().populate({ path: 'items', populate: { path: 'category' } });
    return productLists;
  }
}
export default ProductListController;
