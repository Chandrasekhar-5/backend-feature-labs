import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
const router = Router();


router.get('/all-users', protect, adminOnly, adminController.getAllUsers);

router.delete('/delete-note/:noteId', protect, adminOnly, adminController.deleteAnyNote);

export default router;