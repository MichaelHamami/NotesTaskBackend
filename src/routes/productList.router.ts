import express, { Request, Response } from 'express';
import ProductListController from '../controllers/productList.controller';

const router = express.Router();
const productListControllerinstance = new ProductListController();

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProductList = await productListControllerinstance.deleteProductList(req.params.id);
    return res.send(deletedProductList);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const savedProductList = await productListControllerinstance.createProductList(req.body.name);
    return res.send(savedProductList);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const productLists = await productListControllerinstance.getProductLists();
    return res.send(productLists);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const productList = await productListControllerinstance.getProductList(req.params.id);
    return res.send(productList);
  } catch (error) {
    next(error);
  }
});

export default router;
