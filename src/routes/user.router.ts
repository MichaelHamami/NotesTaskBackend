import express, { Request, Response } from 'express';
import UserController from '../controllers/user.controller';
import { ApplicationError } from '../middlewares/errorHandler';

const router = express.Router();
const userControllerInstance = new UserController();

router.put('/', async (req: Request, res: Response, next) => {
  try {
    if (req.body?.fingerPrint || req.body?.password || req.body?._id || req.body?.email || req.body?.username) {
      throw new ApplicationError(400, 'Invalid request');
    }
    const updatedUser = await userControllerInstance.updateUser(req.user, req.body);
    return res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const user = await userControllerInstance.getUser(req.user);
    return res.send(user);
  } catch (error) {
    next(error);
  }
});

export default router;
