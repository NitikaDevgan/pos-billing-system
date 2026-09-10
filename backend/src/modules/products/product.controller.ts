import type { RequestHandler } from 'express';
import { productService } from './product.service.js';
export const listProducts: RequestHandler = async (_request, response, next) => { try { response.json({ success: true, data: await productService.list() }); } catch (error) { next(error); } };
