import express, { Request, Response } from 'express';
import TaskController from '../controllers/task.controller';
import NoteController from '../controllers/note.controller';

const router = express.Router();
const taskControllerInstance = new TaskController();
const noteControllerInstance = new NoteController();

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const task = await taskControllerInstance.createTask(req.user, req.body);
    return res.send(task);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const tasks = await taskControllerInstance.getAllTasks(req.user);
    return res.send(tasks);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next) => {
  try {
    const task = await taskControllerInstance.updateTask(req.user, req.params.id, req.body);
    const noteWithUpdatedTask = await noteControllerInstance.getNote(req.user, task.note);
    return res.send(noteWithUpdatedTask);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next) => {
  try {
    const updatedNoteRelated = await taskControllerInstance.deleteTask(req.user, req.params.id);
    return res.send(updatedNoteRelated);
  } catch (error) {
    next(error);
  }
});

const millisecondsToSeconds = 1000;
const secondsToMinute = 60;

setInterval(taskControllerInstance.handleEndedTasks, secondsToMinute * millisecondsToSeconds * 5);
export default router;
