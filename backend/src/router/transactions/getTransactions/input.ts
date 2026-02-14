import { zMonthOptional, zYearOptional } from '@budget/shared/src/zod';
import { z } from 'zod';

export const zGetTransactionsTrpcInput = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  year: zYearOptional,
  month: zMonthOptional,
  type: z.enum(['Доход', 'Расход', 'all']).optional(),
});