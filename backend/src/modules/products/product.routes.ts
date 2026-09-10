import { Router } from 'express';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { listProducts } from './product.controller.js';
import { productListSchema } from './product.validator.js';
export const productRouter = Router();
productRouter.get('/', validateRequest(productListSchema), listProducts);
