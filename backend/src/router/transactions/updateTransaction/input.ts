import { z } from 'zod'
import { zCreateTransactionTrpcInput } from '../createTransaction/input'

export const zUpdateTransactionTrpcInput = zCreateTransactionTrpcInput.extend({
  transactionId: z.string().min(1),
})