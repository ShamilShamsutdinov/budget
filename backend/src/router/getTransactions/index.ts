import { transactions } from "../../lib/transactions"
import { trpc } from "../../lib/trpc"

export const getTransactionsTrpcRoute = trpc.procedure.query(() => {
    return { transactions }
  })