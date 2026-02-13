// import { z } from 'zod'

// export const zGetTransactionsTrpcInput = z.object({
//   cursor: z.coerce.number().optional(),
//   limit: z.number().min(1).max(100).default(10),
//   search: z.string().optional()
// })

import { z } from 'zod';

export const zGetTransactionsTrpcInput = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  month: z.number().int().min(1).max(12).optional(),
  type: z.enum(['Доход', 'Расход', 'all']).optional(),
});