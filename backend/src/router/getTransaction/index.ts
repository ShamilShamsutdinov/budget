import { transactions } from "../../lib/transactions"
import { trpc } from "../../lib/trpc"
import { z } from 'zod'

export const getTransactionTrpcRoute = trpc.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input }) => {
      const transaction = transactions.find((transaction) => transaction.id === input.id)
      return { transaction: transaction || null }
})