import Note, { NoteModel } from '../models/note.model';
import Task from '../models/task.model';

class NoteController {
  async deleteNote(id: string) {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      throw new Error('Note not found');
    }
    return deletedNote;
  }

  async createNote(data: Partial<NoteModel>) {
    const title = this.handleTitle(data);
    const note = new Note({ ...data, title, modifiedOn: new Date() });
    const savedNote = await note.save(); // Save the note and get the returned value
    return savedNote;
  }

  async updateNote(id: string, data: Partial<NoteModel>) {
    const note = await Note.findOne({ _id: id });
    if (!note) {
      throw new Error('Note not found');
    }

    note.title = this.handleTitle(data);
    note.content = data.content;
    note.modifiedOn = new Date();
    note.color = data.color || note.color;
    const savedNote = await note.save();
    return savedNote;
  }

  async getNote(id: string) {
    const note = await Note.findOne({ _id: id });
    if (!note) {
      throw new Error('Note not found');
    }
    note.content = await this.handleComponentsOnContent(note.content);
    return note;
  }

  async getNotes() {
    const notes = await Note.find({});

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
    if (title.length <= 0) title = data.content.substring(0, 10);

    if (title.length <= 0) {
      title = new Date().toLocaleDateString().split('T')[0];
    }
    return title;
  }
}
export default NoteController;
