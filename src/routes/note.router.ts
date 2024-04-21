import express, { Request, Response } from 'express';
import NoteController from '../controllers/note.controller';

const router = express.Router();
const noteControllerinstance = new NoteController();

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedNote = await noteControllerinstance.deleteNote(req.params.id);
    return res.send(deletedNote);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const savedNote = await noteControllerinstance.createNote(req.body.content);
    return res.send(savedNote);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const notes = await noteControllerinstance.getNotes();
    return res.send(notes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await noteControllerinstance.getNote(req.params.id);
    return res.send(note);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const note = await noteControllerinstance.updateNote(req.params.id, req.body.content);
    return res.send(note);
  } catch (error) {
    next(error);
  }
});

export default router;
