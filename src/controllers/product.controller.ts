import { ApplicationError } from '../middlewares/errorHandler';
import Product, { ProductModel } from '../models/product.model';

class ProductController {
  async deleteProduct(id: string) {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new ApplicationError(404, 'Product not found');
    }
    return deletedProduct;
  }

  async createProduct(data: Partial<ProductModel>) {
    const product = new Product({ name: data.name, ...data });
    const savedProduct = await product.save();
    return savedProduct;
  }

  async updateProduct(id: string, data: Partial<ProductModel>) {
    const savedProduct = await Product.findByIdAndUpdate(id, { category: data.category, ...data }, { new: true });
    if (!savedProduct) {
      throw new ApplicationError(404, 'Product not found');
    }
    return savedProduct;
  }

  async getProduct(id: string) {
    const product = await Product.findOne({ _id: id }).populate('category');
    if (!product) {
      throw new ApplicationError(404, 'Product not found');
    }
    return product;
  }

  async getProducts() {
    const products = await Product.find().populate('category');
    return products;
  }
}
export default ProductController;
