import { trpc } from "../lib/trpc"
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { createTransactionTrpcRoute } from './createTransaction'
import { getMeTrpcRoute } from './getMe'
import { getTransactionTrpcRoute } from './getTransaction'
import { getTransactionsTrpcRoute } from './getTransactions'
import { signInTrpcRoute } from './signIn'
import { signUpTrpcRoute } from './signUp'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  createTransaction: createTransactionTrpcRoute,
  getMe: getMeTrpcRoute,
  getTransaction: getTransactionTrpcRoute,
  getTransactions: getTransactionsTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter