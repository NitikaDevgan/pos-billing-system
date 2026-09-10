import { Router } from 'express';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { listCategories } from './category.controller.js';
import { categoryListSchema } from './category.validator.js';
export const categoryRouter = Router();
categoryRouter.get('/', validateRequest(categoryListSchema), listCategories);
