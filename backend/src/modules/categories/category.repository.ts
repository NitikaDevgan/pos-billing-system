import { prisma } from '../../config/database.js';

export const getAllCategories = () => {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
