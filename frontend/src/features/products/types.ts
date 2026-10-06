import type { Category } from '../categories/types';

export interface Product {
  id: string;
  name: string;
  /** Prisma Decimal is serialised as a string, e.g. "80.00". */
  price: string;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  price: number;
  categoryId: string;
  isActive: boolean;
}
