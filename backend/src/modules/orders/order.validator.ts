import { z } from 'zod';
// Only product IDs and quantities come from the client — prices are always read from the database.
const orderBody = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive().max(999) })).min(1).max(100),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD']),
  amountReceived: z.number().nonnegative().max(99_999_999).optional(),
});
export const orderCreateSchema = z.object({ body: orderBody, params: z.object({}), query: z.object({}) });
export const orderGetSchema = z.object({ body: z.unknown().optional(), params: z.object({ id: z.string().uuid() }), query: z.object({}) });
export const orderListSchema = z.object({ body: z.unknown().optional(), params: z.object({}), query: z.object({ limit: z.coerce.number().int().positive().max(200).optional() }) });
export type OrderInput = z.infer<typeof orderBody>;
