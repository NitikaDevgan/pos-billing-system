import { Router } from 'express';
import { adminOnly } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { createOrder, getOrder, listOrders } from './order.controller.js';
import { orderCreateSchema, orderGetSchema, orderListSchema } from './order.validator.js';
export const orderRouter = Router();
// The counter has no login yet, so billing and reprinting a bill are open; the sales history is admin-only.
orderRouter.post('/', validateRequest(orderCreateSchema), createOrder);
orderRouter.get('/', ...adminOnly, validateRequest(orderListSchema), listOrders);
orderRouter.get('/:id', validateRequest(orderGetSchema), getOrder);
