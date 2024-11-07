import { ApplicationError } from '../middlewares/errorHandler';
import { TaskModel, TaskType } from '../models/task.model';
import { UserSession } from '../models/user.model';
import Note from '../models/note.model';
import NoteController from './note.controller';
import Task from '../models/task.model';

class TaskController {
  async createTask(user: UserSession, taskInput: TaskModel) {
    if (!taskInput.title || !taskInput.note) {
      throw new ApplicationError(400, 'Missing required fields: title,note');
    }
    const task = new Task({ ...taskInput, user: user.userId });
    const savedTask = await task.save();
    return savedTask;
  }

  async getAllTasks(user: UserSession) {
    const allTasks = await Task.find({ user: user.userId });
    return allTasks;
  }

  async updateTask(user: UserSession, taskId: string, taskInput: TaskModel) {
    const updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: user.userId }, { ...taskInput }, { new: true }).lean();
    if (!updatedTask) {
      throw new ApplicationError(404, 'Task not found');
    }
    return updatedTask;
  }

  async deleteTaskOnNote(user: UserSession, taskId: string, noteId: string) {
    const note = await Note.findOne({ _id: noteId, user: user.userId });
    if (!note) {
      throw new ApplicationError(404, 'note not found');
    }
    const newContent = note.content.replace(`<Task:${taskId}>`, '');
    note.title = note.title;
    note.content = newContent;
    note.modifiedOn = new Date();
    note.color = note.color;
    const savedNote = await note.save();
    const noteControllerInstance = new NoteController();
    savedNote.content = await noteControllerInstance.handleComponentsOnContent(savedNote.content);
    return savedNote;
  }

  async deleteTask(user: UserSession, taskId: string) {
    const deletedTask = await Task.findByIdAndDelete({ _id: taskId, user: user.userId })?.lean();
    if (!deletedTask) {
      throw new ApplicationError(404, 'Task not found');
    }
    const replacedNote = await this.deleteTaskOnNote(user, taskId, deletedTask.note.toString());
    if (!replacedNote) {
      throw new ApplicationError(500, 'Note did not updated');
    }
    return replacedNote;
  }

  async handleEndedTasks() {
    try {
      console.log('handleEndedTasks called', new Date());
      const tasksToUpdate = await Task.find({
        endDate: { $lt: new Date() },
        isCompleted: true,
        type: TaskType.Circular,
        circulationTime: { $gt: 0 },
      });

      await Promise.all(
        tasksToUpdate.map(async (task: any) => {
          console.log('try to update Task:  ', task._id);
          const currentEndDate = task.endDate;
          const minutesToAdd = task.circulationTime;
          const timeToAdd = minutesToAdd * 1000 * 60;

          let counter = 0;
          let isNewEndDateIsValid = false;
          let newEndDate = new Date(currentEndDate.getTime() + timeToAdd);
          const now = new Date();

          isNewEndDateIsValid = newEndDate > now;

          while (!isNewEndDateIsValid && counter < 5) {
            newEndDate = new Date(currentEndDate.getTime() + timeToAdd * (counter + 1));
            counter++;
            isNewEndDateIsValid = newEndDate > now;
          }

          if (!isNewEndDateIsValid) {
            newEndDate = new Date(new Date().getTime() + timeToAdd);
          }
          await Task.updateOne({ _id: task._id }, { $set: { isCompleted: false, endDate: newEndDate } });
        })
      );
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  }
}

export default TaskController;
