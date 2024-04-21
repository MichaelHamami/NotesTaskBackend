import Note from '../models/note.model';
import Task from '../models/task.model';

class NoteController {
  async deleteNote(id: string) {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      throw new Error('Note not found');
    }
    return deletedNote;
  }

  async createNote(content: string) {
    const note = new Note({ content });
    const savedNote = await note.save(); // Save the note and get the returned value
    return savedNote;
  }

  async updateNote(id: string, content: string) {
    const note = await Note.findOne({ _id: id });
    if (!note) {
      throw new Error('Note not found');
    }
    note.content = content;
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
}
export default NoteController;
