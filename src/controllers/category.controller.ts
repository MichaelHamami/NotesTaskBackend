import { ApplicationError } from '../middlewares/errorHandler';
import Category, { CategoryModel } from '../models/category.model';

class CategoryController {
  async deleteCategory(id: string) {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new ApplicationError(404, 'Category not found');
    }
    return deletedCategory;
  }

  async createCategory(data: Partial<CategoryModel>) {
    const category = new Category({ name: data.name, ...data });
    const savedCategory = await category.save();
    return savedCategory;
  }

  async updateCategory(id: string, data: Partial<CategoryModel>) {
    const savedCategory = await Category.findByIdAndUpdate(id, { data }, { new: true });
    if (!savedCategory) {
      throw new ApplicationError(404, 'Category not found');
    }
    return savedCategory;
  }

  async getCategory(id: string) {
    const category = await Category.findOne({ _id: id });
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
