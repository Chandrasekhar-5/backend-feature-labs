import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { me } from '../controllers/user.controller.js';
const router = Router();


router.get('/me', protect, me);

export default router;