import { prisma } from '../../config/database.js';
export const categoryRepository = { findAll: () => prisma.category.findMany({ orderBy: { name: 'asc' } }) };
