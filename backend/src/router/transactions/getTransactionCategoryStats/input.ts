import { zMonthOptional, zPeriodRequared, zYearOptional } from '@budget/shared/src/zod';
import { z } from 'zod';

export const zGetTransactionCategoryStatsTrpcInput = z.object({
  period: zPeriodRequared,
  year: zYearOptional ,
  month: zMonthOptional,
});