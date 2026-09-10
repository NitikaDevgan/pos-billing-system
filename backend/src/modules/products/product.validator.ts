import { z } from 'zod';
export const productListSchema = z.object({ body: z.unknown().optional(), params: z.object({}), query: z.object({}) });
