import { trpc } from "../../../lib/trpc"
import { subWeeks, subMonths, subYears } from 'date-fns';
import { TRPCError } from '@trpc/server';
import { zGetTransactionCategoryStatsTrpcInput } from './input'

export const getTransactionCategoryStatsTrpcRoute = trpc.procedure
  .input(
    zGetTransactionCategoryStatsTrpcInput
  )
  .query(async ({ ctx, input }) => {
    if (!ctx.me) throw new TRPCError({ code: 'UNAUTHORIZED' });

    let dateFilter = {};
    if (input.period !== 'all') {
      const now = new Date();
      let startDate: Date;
      switch (input.period) {
        case 'week':
          startDate = subWeeks(now, 1);
          break;
        case 'month':
          startDate = subMonths(now, 1);
          break;
        case 'year':
          startDate = subYears(now, 1);
          break;
      }
      dateFilter = { date: { gte: startDate } };
    }

    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        ownerId: ctx.me.id,
        ...dateFilter,
      },
      select: { type: true, amount: true, category: true },
    });

    const income: Record<string, number> = {};
    const expense: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'Доход') {
        income[t.category] = (income[t.category] || 0) + t.amount;
      } else {
        expense[t.category] = (expense[t.category] || 0) + t.amount;
      }
    });

    return { income, expense };
  });