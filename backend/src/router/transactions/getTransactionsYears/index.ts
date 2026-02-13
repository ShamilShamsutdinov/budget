import { trpc } from '../../../lib/trpc';
import { TRPCError } from '@trpc/server';

export const getTransactionsYearsTrpcRoute = trpc.procedure
    .query(async ({ ctx }) => {
    if (!ctx.me) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const transactions = await ctx.prisma.transaction.findMany({
        where: { ownerId: ctx.me.id },
        select: { date: true },
    });

    const yearsSet = new Set<number>();
    transactions.forEach((t) => yearsSet.add(t.date.getFullYear()));

    const years = Array.from(yearsSet).sort((a, b) => b - a);
    return { years };
});