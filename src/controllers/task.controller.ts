import { ApplicationError } from '../middlewares/errorHandler';
import { IntervalTimes, TaskModel, TaskType, circulationTime } from '../models/task.model';
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
    const isUpdatingIsCompleted = taskInput.isCompleted ?? false;
    const task = await Task.findOne({ user: user.userId, _id: taskId }).lean();
    if (!task) {
      throw new ApplicationError(404, 'Task not found');
    }

    if (isUpdatingIsCompleted && taskInput.isCompleted === true && !taskInput.endDate) {
      const currentEndDate = new Date(task.endDate);
      const circulationTime = task.circulationTime;
      const nextEndDate = this.calculateNextEndDateByCircularTime(currentEndDate, circulationTime);
      taskInput.endDate = nextEndDate;
    }

    const updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: user.userId }, { ...taskInput }, { new: true }).lean();
    if (!updatedTask) {
      throw new ApplicationError(400, 'Failed to update Task');
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

  private calculateNextEndDateByCircularTime(currentEndDate: Date, circulationTime: circulationTime): Date {
    const now = new Date();
    if (currentEndDate > now) return currentEndDate;

    let counter = 1;
    let newEndDate = this.calculateNewEndDate(currentEndDate, circulationTime, counter);
    let isNewEndDateIsValid = newEndDate > now;

    while (!isNewEndDateIsValid && counter < 100) {
      counter++;
      newEndDate = this.calculateNewEndDate(currentEndDate, circulationTime, counter);
      isNewEndDateIsValid = newEndDate > now;
    }

    if (!isNewEndDateIsValid) {
      newEndDate = this.calculateNewEndDate(now, circulationTime);
    }
    return newEndDate;
  }

  // Helper function to calculate new end date based on circulationTime with an optional multiplier
  private calculateNewEndDate(startDate: Date, circulationTime: IntervalTimes, multiplier = 1): Date {
    const { years = 0, months = 0, days = 0, minutes = 0 } = circulationTime;
    let newEndDate = new Date(startDate);

    // Increment the date by each time component, scaled by the multiplier
    newEndDate.setFullYear(newEndDate.getFullYear() + years * multiplier);
    newEndDate.setMonth(newEndDate.getMonth() + months * multiplier);
    newEndDate.setDate(newEndDate.getDate() + days * multiplier);
    newEndDate.setMinutes(newEndDate.getMinutes() + minutes * multiplier);

    return newEndDate;
  }

  async handleEndedTasks() {
    try {
      console.log('handleEndedTasks called', new Date());
      const tasksToUpdate = await Task.find({
        endDate: { $lt: new Date() },
        isCompleted: true,
        type: TaskType.Circular,
        circulationTime: { $ne: null },
      });

      for await (const task of tasksToUpdate) {
        try {
          console.log('try to update Task:  ', task._id);
          const currentEndDate = new Date(task.endDate);
          const circulationTime = task.circulationTime;

          const nextEndDate = this.calculateNextEndDateByCircularTime(currentEndDate, circulationTime);

          await Task.updateOne({ _id: task._id }, { $set: { isCompleted: false, endDate: nextEndDate } });
        } catch (error) {
          console.error('Error updating task:', error);
        }
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  }
}

export default TaskController;
