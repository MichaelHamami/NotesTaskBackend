import express, { Request, Response } from 'express';
import User from '../models/user.model';
import Category from '../models/category.model';

const router = express.Router();

router.get('/allUsers', async (req: Request, res: Response, next) => {
  try {
    const users = await User.find().lean();

    return res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

router.get('/systemCategories', async (req: Request, res: Response, next) => {
  try {
    const categoriesWithoutUser = await Category.find({ user: { $exists: false } });

    return res.json({ success: true, categories: categoriesWithoutUser });
  } catch (error) {
    next(error);
  }
});

router.post('/createSystemCategories', async (req: Request, res: Response, next) => {
  try {
    const categories = req.body.categories;
    const notAddedCategories = [];

    for (const category of categories) {
      const categoryName = category.name as string;
      if (!categoryName || !categoryName.startsWith('!{') || !categoryName.endsWith('}')) {
        notAddedCategories.push(categoryName);
        continue;
      }
      const newCategory = new Category({ name: categoryName, color: category.color, image: category.image, isSystem: true });
      await newCategory.save();
    }

    return res.json({ success: true, categories: categories, notAddedCategories });
  } catch (error) {
    next(error);
  }
});

export default router;
