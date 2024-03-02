const express = require('express');

const router = express.Router();
const TaskController = require('../controllers/task.controller');
const taskControllerinstance = new TaskController();

// Create a task
router.post('/', async (req, res) => {
  try {
    console.log('create TASK ROUTE CALLED');
    const task = await taskControllerinstance.createTask(req.body)
    return res.send(task);

  } catch (error) {
    return res.status(400).send(error);
  }
});

// Read all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await taskControllerinstance.getAllTasks();
    return res.send(tasks);
  } catch (error) {
   return res.status(500).send(error);
  }
});

// setInterval(taskControllerinstance.handleEndedTasks,   60 * 1000); // Run every minute
module.exports = router;

