import { z } from 'zod'

export const zCreateTransactionTrpcInput = z.object({
    type: z.string(),
    amount: z.number(),
    category: z.string().min(1),
    date: z.string(),
    comment: z.string().optional(),
})