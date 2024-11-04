import express, { Request, Response } from 'express';
import TaskController from '../controllers/task.controller';

const router = express.Router();
const taskControllerInstance = new TaskController();

router.post('/handle-tasks', async (req: Request, res: Response, next) => {
  try {
    taskControllerInstance.handleEndedTasks();
    return res.send('Route triggered successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
