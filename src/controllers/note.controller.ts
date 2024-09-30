import { ApplicationError } from '../middlewares/errorHandler';
import Note, { NoteModel } from '../models/note.model';
import Task from '../models/task.model';
import { UserSession } from '../models/user.model';

class NoteController {
  async deleteNote(user: UserSession, id: string) {
    const deletedNote = await Note.findOneAndDelete({ _id: id, user: user.userId });
    if (!deletedNote) {
      throw new ApplicationError(404, 'Note not found');
    }
    return deletedNote;
  }

  async createNote(user: UserSession, data: Partial<NoteModel>) {
    const title = this.handleTitle(data);
    const note = new Note({ ...data, title, modifiedOn: new Date(), user: user.userId });
    const savedNote = await note.save(); // Save the note and get the returned value
    return savedNote;
  }

  async updateNote(user: UserSession, id: string, data: Partial<NoteModel>) {
    const note = await Note.findOne({ _id: id, user: user.userId });
    if (!note) {
      throw new ApplicationError(404, 'Note not found');
    }

    note.title = data.title !== undefined ? this.handleTitle(data) : note.title;
    note.content = data.content ?? note.content;
    note.modifiedOn = new Date();
    note.color = data.color || note.color;
    const savedNote = await note.save();
    return savedNote;
  }

  async getNote(user: UserSession, id: string) {
    const note = await Note.findOne({ _id: id, user: user.userId });
    if (!note) {
      throw new ApplicationError(404, 'Note not found');
    }
    note.content = await this.handleComponentsOnContent(note.content);
    return note;
  }

  async getNotes(user: UserSession) {
    const notes = await Note.find({ user: user.userId });

    const promises = notes.map(async (note) => {
      note.content = await this.handleComponentsOnContent(note.content);
      return note;
    });

    const processedNotes = await Promise.all(promises);
    return processedNotes;
  }

  async handleComponentsOnContent(content: string) {
    const componentRegex = /<(\w+):(\w+)>/g;
    const matches = [...content.matchAll(componentRegex)];
    let replacedString = content;

    for (const match of matches) {
      const replacement = await this.getNoteReplacerStrWithComponentData(match[0], match[1], match[2]);
      replacedString = replacedString.replace(match[0], replacement);
    }
    return replacedString;
  }

  async getNoteReplacerStrWithComponentData(matchedString: string, componentName: string, componentId: string) {
    try {
      switch (componentName?.toLowerCase()) {
        case 'task':
          const task = await Task.findOne({ _id: componentId });
          return `<${componentName}:${componentId}:${JSON.stringify(task.toJSON({ flattenObjectIds: true }))}>`;
        default:
          return matchedString;
      }
    } catch (error) {
      return matchedString;
    }
  }
  handleTitle(data: Partial<NoteModel>) {
    let title = data.title;
    if (title?.length > 0) return title;
    title = data.content.substring(0, 10);
    if (title?.length > 0) return title;
    return new Date().toLocaleDateString().split('T')[0];
  }
}
export default NoteController;
