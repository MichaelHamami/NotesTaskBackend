const Task = require('../models/task.model').default;

class TaskController {
  async createTask(taskInput: any) {
    const task = new Task(taskInput);
    const savedTask = await task.save();
    return savedTask;
  }

  async getAllTasks() {
    const allTasks = await Task.find();
    return allTasks;
  }

  async handleEndedTasks() {
    try {
      console.log('handleEndedTasks called', new Date());
      const tasksToUpdate = await Task.find({
        endDate: { $lt: new Date() },
        isCompleted: true,
      });

      await Promise.all(
        tasksToUpdate.map(async (task:any) => {
          console.log('try to update Task:  ', task._id);
          const currentEndDate = task.endDate;
          const secondsToAdd = task.circulationTime;

          const newEndDate = new Date(currentEndDate.getTime() + secondsToAdd * 1000); // Convert seconds to milliseconds
          // Update task fields
          await Task.updateOne({ _id: task._id }, { $set: { isCompleted: false, endDate: newEndDate } });
        })
      );
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  }
}

export default TaskController;
