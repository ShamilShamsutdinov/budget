import { trpc } from '../../../lib/trpc';
import { TRPCError } from '@trpc/server';
import { zGetTransactionCategoryStatsTrpcInput } from './input';

export const getTransactionCategoryStatsTrpcRoute = trpc.procedure
  .input(zGetTransactionCategoryStatsTrpcInput)
  .query(async ({ ctx, input }) => {
    if (!ctx.me) throw new TRPCError({ code: 'UNAUTHORIZED' });

    let dateFilter = {};

    if (input.month !== undefined) {
      const now = new Date();
      const year = input.year ?? now.getFullYear(); // если год не указан — текущий
      dateFilter = {
        date: {
          gte: new Date(year, input.month - 1, 1),
          lte: new Date(year, input.month, 0, 23, 59, 59, 999),
        },
      };
    }
    // Если указан только year (без month) — весь год
    else if (input.year !== undefined) {
      dateFilter = {
        date: {
          gte: new Date(input.year, 0, 1),
          lte: new Date(input.year, 11, 31, 23, 59, 59, 999),
        },
      };
    }
    // Иначе — используем period
    else if (input.period !== 'all') {
      const now = new Date();
      let startDate: Date;
      switch (input.period) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
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