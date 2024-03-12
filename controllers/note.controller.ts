import Note from '../models/note.model';
import Task from '../models/task.model';

class NoteController {
  async createNote(content:string) {
    const note = new Note(content);
    const savedNote = await note.save(); // Save the note and get the returned value
    return savedNote;
  }

  async getNote(id:string) {
    const note = await Note.findOne({ _id: id });
    if (!note) {
      throw new Error('Note not found');
    }
    console.log(note);
    note.content = await this.handleComponentsOnContent(note.content);
    console.log(note);
    return note;
  }

  async getNotes() {
    const notes = await Note.find({});

    const promises = notes.map(async (note) => {
      note.content = await this.handleComponentsOnContent(note.content);
      return note;
    });

    const processedNotes = await Promise.all(promises);
    console.log(processedNotes);
    return processedNotes;
  }

  async handleComponentsOnContent(content:string) {
    // Here we can add some logic to handle the content
    // in Note there is a tags that look like this <componentName:{id}>
    // We can replace this with the actual component
    // For example <image:123> will be replaced with the actual image
    // We can use a service to get the component and replace it
    // Regular expression to match the component tags
    const componentRegex = /<(\w+):(\w+)>/g;

    const replacedContent = await Promise.all(
      Array.from(content.matchAll(componentRegex), async (match) => {
        const [, componentName, componentId] = match;
        console.log(`Getting component ${componentName} with id ${componentId}`);

        switch (componentName?.toLowerCase()) {
          case 'task':
            const task = await Task.findOne({ _id: componentId });
            console.log('task:', task);
            return `<${componentName}:${componentId}:${task}>`;
          default:
            return 'fullMatch';
        }
      })
    );
    console.log(replacedContent);
    return replacedContent.toString();
  }
}

export default NoteController;
