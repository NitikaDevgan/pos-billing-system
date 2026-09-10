import { prisma } from '../../config/database.js';
export const productRepository = { findAll: () => prisma.product.findMany({ include: { category: true }, orderBy: { name: 'asc' } }) };
