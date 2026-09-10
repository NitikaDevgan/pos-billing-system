import type { RequestHandler } from 'express';
import { categoryService } from './category.service.js';
export const listCategories: RequestHandler = async (_request, response, next) => { try { response.json({ success: true, data: await categoryService.list() }); } catch (error) { next(error); } };
