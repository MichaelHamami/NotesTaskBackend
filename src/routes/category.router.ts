import express, { Request, Response } from 'express';
import CategoryController from '../controllers/category.controller';

const router = express.Router();
const categoryControllerInstance = new CategoryController();

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedCategory = await categoryControllerInstance.deleteCategory(req.user, req.params.id);
    return res.send(deletedCategory);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const savedCategory = await categoryControllerInstance.createCategory(req.user, req.body);
    return res.send(savedCategory);
  } catch (error) {
    next(error);
  }
});

router.put('/id', async (req: Request, res: Response, next) => {
  try {
    const updatedCategory = await categoryControllerInstance.updateCategory(req.user, req.params.id, req.body);
    return res.send(updatedCategory);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const categories = await categoryControllerInstance.getCategories(req.user);
    return res.send(categories);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const category = await categoryControllerInstance.getCategory(req.user, req.params.id);
    return res.send(category);
  } catch (error) {
    next(error);
  }
});

export default router;
