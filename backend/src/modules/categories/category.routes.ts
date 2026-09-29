// category.routes.ts
import { Router } from 'express';
import { getCategories } from './category.controller.js';

export const categoryRoutes = Router();

categoryRoutes.get('/', getCategories);