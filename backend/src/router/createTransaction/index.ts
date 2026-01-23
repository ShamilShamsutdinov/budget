import { transactions } from '../../lib/transactions'
import { trpc } from "../../lib/trpc"
import { z } from 'zod'

export const createTransactionTrpcRoute = trpc.procedure
    .input(
      z.object({
        type: z.enum(['income', 'expense']),
        amount: z.string(),
        category: z.string().min(1),
        date: z.string(),
        comment: z.string().optional(),
      })
    )
    .mutation(({ input }) => {

      const transaction = {
        ...input,
        id: crypto.randomUUID(),
        comment: input.comment || '', 
      }

      transactions.unshift(transaction)
      return true
})