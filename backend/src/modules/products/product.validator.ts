import { z } from 'zod';
const idParams = z.object({ id: z.string().uuid() });
const productBody = z.object({ name: z.string().trim().min(1).max(80), price: z.coerce.number().nonnegative().max(99_999_999), categoryId: z.string().uuid(), isActive: z.boolean().default(true) });
export const productListSchema = z.object({ body: z.unknown().optional(), params: z.object({}), query: z.object({}) });
export const productCreateSchema = z.object({ body: productBody, params: z.object({}), query: z.object({}) });
export const productUpdateSchema = z.object({ body: productBody, params: idParams, query: z.object({}) });
export const productDeleteSchema = z.object({ body: z.unknown().optional(), params: idParams, query: z.object({}) });
export type ProductInput = z.infer<typeof productBody>;
