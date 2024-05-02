import express, { Request, Response } from 'express';
import ProductController from '../controllers/product.controller';

const router = express.Router();
const productControllerInstance = new ProductController();

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProduct = await productControllerInstance.deleteProduct(req.params.id);
    return res.send(deletedProduct);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const savedProduct = await productControllerInstance.createProduct(req.body);
    return res.send(savedProduct);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next) => {
  try {
    const updatedProduct = await productControllerInstance.updateProduct(req.params.id, req.body);
    return res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const products = await productControllerInstance.getProducts();
    return res.send(products);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await productControllerInstance.getProduct(req.params.id);
    return res.send(product);
  } catch (error) {
    next(error);
  }
});

export default router;
