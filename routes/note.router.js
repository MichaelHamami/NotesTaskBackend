const express = require('express');
const Note = require('../models/note.model');

const router = express.Router();
const NoteController = require('../controllers/note.controller');
const noteControllerinstance = new NoteController();

// Create a note
router.post('/', async (req, res) => {
  try {
    await noteControllerinstance.createNote(req.body.content)
    console.log("asdasdas")
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Read all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.send(notes);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;