import { Router } from 'express';
import { adminOnly } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { createProduct, deleteProduct, listProducts, updateProduct } from './product.controller.js';
import { productCreateSchema, productDeleteSchema, productListSchema, productUpdateSchema } from './product.validator.js';
export const productRouter = Router();
// Reading the menu is public (the POS needs it); changing it is admin-only.
productRouter.get('/', validateRequest(productListSchema), listProducts);
productRouter.post('/', ...adminOnly, validateRequest(productCreateSchema), createProduct);
productRouter.put('/:id', ...adminOnly, validateRequest(productUpdateSchema), updateProduct);
productRouter.delete('/:id', ...adminOnly, validateRequest(productDeleteSchema), deleteProduct);
