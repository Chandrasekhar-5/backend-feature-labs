import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import * as noteController from '../controllers/note.controller.js';

const router = Router();


router.post('/create-note', protect, noteController.createNote);


export default router;