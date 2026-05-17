import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import * as noteController from '../controllers/note.controller.js';

const router = Router();


router.post('/create-note', protect, noteController.createNote);

router.get('/my-notes', protect, noteController.getMyNotes);

router.put('/update-note/:noteId', protect, noteController.updateNote);

router.delete('/delete-note/:noteId', protect, noteController.deleteNote);


export default router;