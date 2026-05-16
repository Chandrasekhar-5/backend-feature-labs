import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();


router.post('/register', authController.register);


router.get('/login', authController.login);


router.get('/refresh-token', authController.refreshToken);


export default router;