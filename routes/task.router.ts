import express,{Request,Response} from 'express';
import TaskController from '../controllers/task.controller';

const router = express.Router();
const taskControllerinstance = new TaskController();

// Create a task
router.post('/', async (req:Request, res:Response) => {
  try {
    const task = await taskControllerinstance.createTask(req.body)
    return res.send(task);

  } catch (error) {
    return res.status(400).send(error);
  }
});

// Read all tasks
router.get('/', async (req:Request, res:Response) => {
  try {
    const tasks = await taskControllerinstance.getAllTasks();
    return res.send(tasks);
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
});

// setInterval(taskControllerinstance.handleEndedTasks,   60 * 1000); // Run every minute
export default router;

