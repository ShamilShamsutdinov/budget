import { trpc } from "../lib/trpc"
import { getTransactionTrpcRoute } from "./getTransaction"
import { getTransactionsTrpcRoute } from "./getTransactions"

export const trpcRouter = trpc.router({
   getTransaction: getTransactionTrpcRoute,
   getTransactions: getTransactionsTrpcRoute
})

export type TrpcRouter = typeof trpcRouter