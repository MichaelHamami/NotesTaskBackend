import express, { Request, Response } from 'express';
import ProductListController from '../controllers/productList.controller';

const router = express.Router();
const productListControllerInstance = new ProductListController();

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProductList = await productListControllerInstance.deleteProductList(req.params.id);
    return res.send(deletedProductList);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const savedProductList = await productListControllerInstance.createProductList(req.body.name, req.body.type);
    return res.send(savedProductList);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const duplicatedProductList = await productListControllerInstance.duplicateProductList(req.params.id, req.body.name);
    return res.send(duplicatedProductList);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/add-product', async (req: Request, res: Response, next) => {
  try {
    const savedProductList = await productListControllerInstance.newItemToProductList(req.params.id, req.body);
    return res.send(savedProductList);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next) => {
  try {
    const updatedProductList = await productListControllerInstance.updateProductList(req.params.id, req.body);
    return res.send(updatedProductList);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const productLists = await productListControllerInstance.getProductLists();
    return res.send(productLists);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const productList = await productListControllerInstance.getProductList(req.params.id);
    return res.send(productList);
  } catch (error) {
    next(error);
  }
});

export default router;
