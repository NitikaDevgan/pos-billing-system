import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { getMe, login } from './auth.controller.js';
import { loginSchema } from './auth.validator.js';
export const authRouter = Router();
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.get('/me', authenticate, getMe);
