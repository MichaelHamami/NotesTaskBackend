import express, { Request, Response } from 'express';
import ProductListController from '../controllers/productList.controller';

const router = express.Router();
const productListControllerInstance = new ProductListController();

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProductList = await productListControllerInstance.deleteProductList(req.user, req.params.id);
    return res.send(deletedProductList);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const savedProductList = await productListControllerInstance.createProductList(req.user, req.body.name, req.body.type);
    return res.send(savedProductList);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/relative-shopping-list', async (req, res, next) => {
  try {
    const calculatedShoppingList = await productListControllerInstance.createRelativeShoppingList(req.user, req.params.id, req.body.name);
    return res.send(calculatedShoppingList);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const duplicatedProductList = await productListControllerInstance.duplicateProductList(req.user, req.params.id, req.body.name);
    return res.send(duplicatedProductList);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/add-product', async (req: Request, res: Response, next) => {
  try {
    const savedProductList = await productListControllerInstance.newItemToProductList(req.user, req.params.id, req.body);
    return res.send(savedProductList);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/batch-delete', async (req: Request, res: Response, next) => {
  try {
    const { itemIds } = req.body;
    const updatedProductList = await productListControllerInstance.deleteItems(req.user, req.params.id, itemIds);
    return res.send(updatedProductList);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/batch-update', async (req: Request, res: Response, next) => {
  try {
    const { itemIds, itemData } = req.body;
    const updatedProductList = await productListControllerInstance.updateItems(req.user, req.params.id, itemIds, itemData);
    return res.send(updatedProductList);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next) => {
  try {
    const updatedProductList = await productListControllerInstance.updateProductList(req.user, req.params.id, req.body);
    return res.send(updatedProductList);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const productLists = await productListControllerInstance.getProductLists(req.user);
    return res.send(productLists);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const productList = await productListControllerInstance.getProductList(req.user, req.params.id);
    return res.send(productList);
  } catch (error) {
    next(error);
  }
});

export default router;
