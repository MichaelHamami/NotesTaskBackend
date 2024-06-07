import { ApplicationError } from '../middlewares/errorHandler';
import Category, { CategoryModel } from '../models/category.model';
import { UserSession } from '../models/user.model';

class CategoryController {
  async deleteCategory(user: UserSession, id: string) {
    const deletedCategory = await Category.findOneAndDelete({ _id: id, user: user.userId });
    if (!deletedCategory) {
      throw new ApplicationError(404, 'Category not found');
    }
    return deletedCategory;
  }

  async createCategory(user: UserSession, data: Partial<CategoryModel>) {
    const category = new Category({ name: data.name, ...data, user: user.userId });
    const savedCategory = await category.save();
    return savedCategory;
  }

  async updateCategory(user: UserSession, id: string, data: Partial<CategoryModel>) {
    const savedCategory = await Category.findOneAndUpdate({ _id: id, user: user.userId }, { data }, { new: true });
    if (!savedCategory) {
      throw new ApplicationError(404, 'Category not found');
    }
    return savedCategory;
  }

  async getCategory(user: UserSession, id: string) {
    const category = await Category.findOne({ _id: id, user: user.userId });
    if (!category) {
      throw new ApplicationError(404, 'Category not found');
    }
    return category;
  }

  async getCategories() {
    const categories = await Category.find();
    return categories;
  }
}
export default CategoryController;
