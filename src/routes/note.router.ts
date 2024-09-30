import express, { Request, Response } from 'express';
import NoteController from '../controllers/note.controller';

const router = express.Router();
const noteControllerInstance = new NoteController();

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedNote = await noteControllerInstance.deleteNote(req.user, req.params.id);
    return res.send(deletedNote);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const savedNote = await noteControllerInstance.createNote(req.user, req.body);
    return res.send(savedNote);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next) => {
  try {
    const notes = await noteControllerInstance.getNotes(req.user);
    return res.send(notes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await noteControllerInstance.getNote(req.user, req.params.id);
    return res.send(note);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const note = await noteControllerInstance.updateNote(req.user, req.params.id, req.body);
    return res.send(note);
  } catch (error) {
    next(error);
  }
});

export default router;
