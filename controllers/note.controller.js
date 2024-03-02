const Note = require('../models/note.model')

class NoteController {
    async createNote(content){
            const note = new Note(content);
            const savedNote = await note.save(); // Save the note and get the returned value
            return savedNote
}
}

module.exports = NoteController;
