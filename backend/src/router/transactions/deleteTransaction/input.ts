import { z } from 'zod'

export const zCreateTransactionTrpcInput = z.object({
    id: z.string().uuid(),
})