// import { z } from 'zod'

// export const zComparisonTransactionTrpcInput = z.object({
//     type: z.string(),
//     amount: z.number(),
//     date: z.string()
// })

import { z } from 'zod';

export const zGetPeriodComparisonTrpcInput = z.object({
  period: z.enum(['week', 'month', 'all']).default('month'),
  year: z.number().int().min(2000).max(2100).optional(),
  month: z.number().int().min(1).max(12).optional(),
});