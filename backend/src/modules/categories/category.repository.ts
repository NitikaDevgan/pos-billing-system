import { prisma } from '../../config/database.js';
import type { CategoryInput } from './category.validator.js';

// Inactive categories are returned too so the admin screen can re-enable them; the POS filters them out.
export const getAllCategories = () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const createCategory = (data: CategoryInput) => prisma.category.create({ data });

export const updateCategory = (id: string, data: CategoryInput) => prisma.category.update({ where: { id }, data });

export const countProducts = (categoryId: string) => prisma.product.count({ where: { categoryId } });

export const deleteCategory = (id: string) => prisma.category.delete({ where: { id } });
