import { zMonthOptional, zPeriodRequared, zYearOptional } from '@budget/shared/src/zod';
import { z } from 'zod';

export const zGetPeriodComparisonTrpcInput = z.object({
  period: zPeriodRequared,
  year: zYearOptional,
  month: zMonthOptional,
});