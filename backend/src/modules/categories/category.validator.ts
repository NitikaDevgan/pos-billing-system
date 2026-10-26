import { z } from 'zod';
const idParams = z.object({ id: z.string().uuid() });
const categoryBody = z.object({ name: z.string().trim().min(1).max(50), isActive: z.boolean().default(true) });
export const categoryListSchema = z.object({ body: z.unknown().optional(), params: z.object({}), query: z.object({}) });
export const categoryCreateSchema = z.object({ body: categoryBody, params: z.object({}), query: z.object({}) });
export const categoryUpdateSchema = z.object({ body: categoryBody, params: idParams, query: z.object({}) });
export const categoryDeleteSchema = z.object({ body: z.unknown().optional(), params: idParams, query: z.object({}) });
export type CategoryInput = z.infer<typeof categoryBody>;
