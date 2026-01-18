import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const transactions = [
  { id: '1', name: 'Shamil', transaction: '100 000 р', category: 'Еда', comment: 'Сходили в ресторан' },
  { id: '2', name: 'Shamil', transaction: '50 000 р', category: 'Развлечения', comment: '' }
]

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getTransactions: trpc.procedure.query(() => {
    return { transactions }
  }),
  getTransaction: trpc.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input }) => {
      const transaction = transactions.find((transaction) => transaction.id === input.id)
      return { transaction: transaction || null }
  }),
})

export type TrpcRouter = typeof trpcRouter