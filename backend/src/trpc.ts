import { initTRPC } from '@trpc/server'

const transactions = [
  { id: '1', name: 'Shamil', transactions: '25 000р', category: 'Еда' },
  { id: '2', name: 'Shamil', transactions: '50 000р', category: 'Развлечения' }
]

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getTransactions: trpc.procedure.query(() => {
    return { transactions }
  }),
})

export type TrpcRouter = typeof trpcRouter