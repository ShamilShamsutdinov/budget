import { z } from 'zod'

export const zGetTransactionCategoryStatsTrpcInput = z.object({
  period: z.enum(['week', 'month', 'year', 'all']).default('month'),
})