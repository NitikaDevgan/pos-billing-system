import { z } from 'zod';
export const categoryListSchema = z.object({ body: z.unknown().optional(), params: z.object({}), query: z.object({}) });
