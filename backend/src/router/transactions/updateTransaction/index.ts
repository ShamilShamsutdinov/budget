import { trpc } from '../../../lib/trpc'
import { zUpdateTransactionTrpcInput } from './input'

export const updateTransactionTrpcRoute = trpc.procedure.input(zUpdateTransactionTrpcInput).mutation(async ({ ctx, input }) => {
  const { transactionId, ...transactionInput } = input
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const transaction = await ctx.prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  })
  if (!transaction) {
    throw new Error('NOT_FOUND')
  }
  if (ctx.me.id !== transaction.ownerId) {
    throw new Error('NOT_YOUR_IDEA')
  }

  const updatedTransaction = await ctx.prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      ...transactionInput,
      date: new Date(transactionInput.date),
    },
  })
  return updatedTransaction 
})