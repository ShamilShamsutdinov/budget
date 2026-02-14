import { zNumberRequired, zStringOptional, zStringRequired } from '@budget/shared/src/zod'
import { z } from 'zod'

export const zCreateTransactionTrpcInput = z.object({
    type: zStringRequired ,
    amount: zNumberRequired,
    category: zStringRequired ,
    date: zStringRequired ,
    comment: zStringOptional,
})