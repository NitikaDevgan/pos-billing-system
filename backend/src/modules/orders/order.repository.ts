import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
const withItems = { items: { orderBy: { name: 'asc' } } } satisfies Prisma.OrderInclude;
export const orderRepository = {
  findProducts: (ids: string[]) => prisma.product.findMany({ where: { id: { in: ids } }, include: { category: true } }),
  create: (data: Prisma.OrderCreateInput) => prisma.order.create({ data, include: withItems }),
  findById: (id: string) => prisma.order.findUnique({ where: { id }, include: withItems }),
  findRecent: (limit: number) => prisma.order.findMany({ include: withItems, orderBy: { createdAt: 'desc' }, take: limit }),
};
