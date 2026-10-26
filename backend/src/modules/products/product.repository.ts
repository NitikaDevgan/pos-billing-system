import { prisma } from '../../config/database.js';
import type { ProductInput } from './product.validator.js';
export const productRepository = {
  findAll: () => prisma.product.findMany({ include: { category: true }, orderBy: { name: 'asc' } }),
  create: (data: ProductInput) => prisma.product.create({ data, include: { category: true } }),
  update: (id: string, data: ProductInput) => prisma.product.update({ where: { id }, data, include: { category: true } }),
  delete: (id: string) => prisma.product.delete({ where: { id } }),
};
