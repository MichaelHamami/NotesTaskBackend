import express, { Request, Response } from 'express';
import NoteController from '../controllers/note.controller';

const router = express.Router();
const noteControllerinstance = new NoteController();

// Create a note
router.post('/', async (req: Request, res: Response) => {
  try {
    await noteControllerinstance.createNote(req.body.content);
    console.log('asdasdasasdasdasds');
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
});

// Read all notes
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('get all notes');
    const notes = await noteControllerinstance.getNotes();
    return res.send(notes);
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
});

// Read a note
router.get('/:id', async (req, res) => {
  try {
    const note = await noteControllerinstance.getNote(req.params.id);
    return res.send(note || {});
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error');
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const note = await noteControllerinstance.updateNote(req.params.id, req.body.content);
    return res.send(note);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default router;
