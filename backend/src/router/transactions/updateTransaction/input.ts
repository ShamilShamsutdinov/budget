import { z } from 'zod'
import { zCreateTransactionTrpcInput } from '../createTransaction/input'
import { zStringRequired } from '@budget/shared/src/zod'

export const zUpdateTransactionTrpcInput = zCreateTransactionTrpcInput.extend({
  transactionId: zStringRequired,
})