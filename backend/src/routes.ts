import { Router } from 'express';
import { categoryRoutes }  from './modules/categories/category.routes.js';
import { healthRouter } from './modules/health/health.routes.js';
import { productRouter } from './modules/products/product.routes.js';
export const apiRouter = Router();
apiRouter.use('/health', healthRouter);
apiRouter.use('/v1/categories', categoryRoutes);
apiRouter.use('/v1/products', productRouter);
