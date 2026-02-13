import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { trpc } from "../lib/trpc"
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { createTransactionTrpcRoute } from './transactions/createTransaction'
import { deleteTransactionTrpcRoute } from './transactions/deleteTransaction'
import { getPeriodComparisonTrpcRoute } from './transactions/getPeriodComparison'
import { getTransactionTrpcRoute } from './transactions/getTransaction'
import { getTransactionCategoryStatsTrpcRoute } from './transactions/getTransactionCategoryStats'
import { getTransactionsTrpcRoute } from './transactions/getTransactions'
import { getTransactionsYearsTrpcRoute } from './transactions/getTransactionsYears'
import { updateTransactionTrpcRoute } from './transactions/updateTransaction'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  createTransaction: createTransactionTrpcRoute,
  deleteTransaction: deleteTransactionTrpcRoute,
  getPeriodComparison: getPeriodComparisonTrpcRoute,
  getTransaction: getTransactionTrpcRoute,
  getTransactionCategoryStats: getTransactionCategoryStatsTrpcRoute,
  getTransactions: getTransactionsTrpcRoute,
  getTransactionsYears: getTransactionsYearsTrpcRoute,
  updateTransaction: updateTransactionTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>