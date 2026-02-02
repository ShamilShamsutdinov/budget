import { trpc } from "../../../lib/trpc"

export const getTransactionsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {

if (!ctx.me) {
  throw new Error('UNAUTHORIZED')
}

const transactions = await ctx.prisma.transaction.findMany({
  where: {
    ownerId: ctx.me.id 
  },
  select: {
    id: true,
    type: true,
    amount: true,
    category: true,
    date: true,
    comment: true
  },
  orderBy: {
    date: 'desc',
  }
})

  return { transactions }
})