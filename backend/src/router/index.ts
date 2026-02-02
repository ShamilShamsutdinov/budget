import { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { trpc } from "../lib/trpc"
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { getMeTrpcRoute } from './getMe'
import { createTransactionTrpcRoute } from './transactions/createTransaction'
import { getTransactionTrpcRoute } from './transactions/getTransaction'
import { getTransactionsTrpcRoute } from './transactions/getTransactions'
import { updateTransactionTrpcRoute } from './transactions/updateTransaction'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  getMe: getMeTrpcRoute,
  createTransaction: createTransactionTrpcRoute,
  getTransaction: getTransactionTrpcRoute,
  getTransactions: getTransactionsTrpcRoute,
  updateTransaction: updateTransactionTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>