// category.routes.ts
import { Router } from 'express';
import { adminOnly } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { createCategory, deleteCategory, getCategories, updateCategory } from './category.controller.js';
import { categoryCreateSchema, categoryDeleteSchema, categoryListSchema, categoryUpdateSchema } from './category.validator.js';

export const categoryRoutes = Router();

// Reading is public (the POS needs it); changing categories is admin-only.
categoryRoutes.get('/', validateRequest(categoryListSchema), getCategories);
categoryRoutes.post('/', ...adminOnly, validateRequest(categoryCreateSchema), createCategory);
categoryRoutes.put('/:id', ...adminOnly, validateRequest(categoryUpdateSchema), updateCategory);
categoryRoutes.delete('/:id', ...adminOnly, validateRequest(categoryDeleteSchema), deleteCategory);
