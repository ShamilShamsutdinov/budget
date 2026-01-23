import { trpc } from "../../lib/trpc"

export const getTransactionsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
const transactions = await ctx.prisma.transaction.findMany({
  select: {
    id: true,
    type: true,
    amount: true,
    category: true,
    date: true,
    comment: true
  },
})

  return { transactions }
})