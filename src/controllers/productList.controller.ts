import { ApplicationError } from '../middlewares/errorHandler';
import { ProductModel } from '../models/product.model';
import ProductList, { ProductListModel, ProductListType } from '../models/productList.model';
import { UserSession } from '../models/user.model';
import ProductController from './product.controller';

class ProductListController {
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
  }

  async createRelativeShoppingList(user: UserSession, id: string, name: string) {
    if (!name) throw new ApplicationError(400, 'ProductList name invalid');

    const productList = (await ProductList.findOne({ _id: id }).populate('items').lean()) as ProductListModel;
    if (!productList) {
      throw new ApplicationError(404, 'ProductList not found');
    }

    if (productList.type !== ProductListType.HOME) {
      throw new ApplicationError(400, 'ProductList type invalid');
    }

    const newProductList = await this.createProductList(user, name, ProductListType.SHOPPING);
    let itemsIds = [];
    for (const item of productList.items) {
      const itemData = item as ProductModel;
      if (!itemData) throw new ApplicationError(404, 'Product not found');

      if (itemData.quantity <= 0 && itemData.current_quantity >= 0 && itemData.current_quantity < itemData.quantity) continue;

      const dataOfNewProduct = {
        ...itemData,
        quantity: itemData.quantity - itemData.current_quantity,
        category: itemData.category.toString(),
        _id: undefined,
      };

      const newProduct = await this.productController.createProduct(dataOfNewProduct);
      if (!newProduct) continue;

      itemsIds.push(newProduct._id.toString());
    }

    return await this.updateProductList(user, newProductList._id.toString(), { items: itemsIds });
  }

  async deleteItems(user: UserSession, id: string, itemIds: string[]) {
    const productList = await ProductList.findOne({ _id: id, user: user.userId }).lean();
    if (!productList) {
      throw new ApplicationError(404, 'ProductList not found');
    }

    let deletedItems = [];
    for await (const itemId of itemIds) {
      try {
        const data = await this.productController.deleteProduct(itemId);
        if (!data) throw new ApplicationError(400, 'Product Not deleted');
        deletedItems.push(itemId);
      } catch (error) {}
    }

    const newItems = productList.items.filter((item) => !itemIds.includes(item._id.toString())).map((item) => item._id.toString());
    return await this.updateProductList(user, id, { items: newItems });
  }

  async updateItems(user: UserSession, id: string, itemIds: string[], itemData: Partial<ProductModel>) {
    for await (const itemId of itemIds) {
      await this.productController.updateProduct(itemId, itemData);
    }
    return await this.getProductList(user, id);
  }

  async duplicateProductList(user: UserSession, id: string, name: string) {
    const productList = (await ProductList.findOne({ _id: id }).populate('items').lean()) as ProductListModel;
    if (!productList) {
      throw new ApplicationError(404, 'ProductList not found');
    }

    const newProductList = await this.createProductList(user, name, productList.type);
    let itemsIds = [];
    for (const item of productList.items) {
      const itemData = item as ProductModel;
      if (!itemData) throw new ApplicationError(404, 'Product not found');

      const dataOfNewProduct = {
        ...itemData,
        category: itemData.category.toString(),
        _id: undefined,
      };

      const newProduct = await this.productController.createProduct(dataOfNewProduct);
      if (!newProduct) throw new ApplicationError(400, 'Product invalid data');

      itemsIds.push(newProduct._id.toString());
    }

    return await this.updateProductList(user, newProductList._id.toString(), { items: itemsIds });
  }

  async newItemToProductList(user: UserSession, id: string, data: Partial<ProductModel>) {
    const productList = await this.getProductList(user, id);
    if (!productList) {
      throw new ApplicationError(404, 'ProductList not found');
    }

    const product = await this.productController.createProduct(data);
    if (!product) throw new ApplicationError(400, 'Product invalid data');

    const newItems = [product._id.toString(), ...productList.items.map((item) => item._id.toString())];
    return await this.updateProductList(user, id, { items: newItems });
  }

  async deleteProductList(user: UserSession, id: string) {
    const deletedProductList = await ProductList.findOneAndDelete({ _id: id, user: user.userId });
    if (!deletedProductList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
    return deletedProductList;
  }

  async createProductList(user: UserSession, name: string, type: number) {
    if (!name) throw new ApplicationError(400, 'ProductList name invalid');

    const productList = new ProductList({ name, type, user: user.userId });
    const savedProductList = await productList.save();
    return savedProductList;
  }

  async updateProductList(user: UserSession, id: string, data: Partial<ProductListModel>) {
    const savedProductList = await ProductList.findOneAndUpdate(
      { _id: id, user: user.userId },
      { name: data.name, items: data.items, type: data.type },
      { new: true }
    ).populate({ path: 'items', populate: { path: 'category' } });
    if (!savedProductList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
    return savedProductList;
  }

  async getProductList(user: UserSession, id: string) {
    const productList = await ProductList.findOne({ _id: id, user: user.userId }).populate({ path: 'items', populate: { path: 'category' } });
    if (!productList) {
      throw new ApplicationError(404, 'ProductList not found');
    }
    return productList;
  }

  async getProductLists(user: UserSession) {
    const productLists = await ProductList.find({ user: user.userId }).populate({ path: 'items', populate: { path: 'category' } });
    return productLists;
  }
}
export default ProductListController;
