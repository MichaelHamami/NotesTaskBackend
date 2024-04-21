import express, { Request, Response } from 'express';
import TaskController from '../controllers/task.controller';

const router = express.Router();
const taskControllerinstance = new TaskController();

// Create a task
router.post('/', async (req: Request, res: Response, next) => {
  try {
    const task = await taskControllerinstance.createTask(req.body);
    return res.send(task);
  } catch (error) {
    next(error);
  }
});

// Read all tasks
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const tasks = await taskControllerinstance.getAllTasks();
    return res.send(tasks);
  } catch (error) {
    next(error);
  }
});

// setInterval(taskControllerinstance.handleEndedTasks,   60 * 1000); // Run every minute
export default router;
