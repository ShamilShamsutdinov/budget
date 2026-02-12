import { z } from 'zod'

export const zComparisonTransactionTrpcInput = z.object({
    type: z.string(),
    amount: z.number(),
    date: z.string()
})