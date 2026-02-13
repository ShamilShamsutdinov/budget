import { z } from 'zod';

export const zGetTransactionCategoryStatsTrpcInput = z.object({
  period: z.enum(['week', 'month', 'all']).default('month'),
  year: z.number().int().min(2000).max(2100).optional(),
  month: z.number().int().min(1).max(12).optional(),
});