import { trpc } from "../../lib/trpc"
import { z } from 'zod'

export const createTransactionTrpcRoute = trpc.procedure
    .input(
      z.object({
        type: z.string(),
        amount: z.number(),
        category: z.string().min(1),
        date: z.string(),
        comment: z.string().optional(),
      })
    ) 
    .mutation(async ({ ctx, input }) => {
    
    const newTransaction = await ctx.prisma.transaction.create({
      data: {
        type: input.type,
        amount: input.amount, 
        category: input.category,
        date: new Date(input.date),
        comment: input.comment || null, 
      },
    })

    return {newTransaction}
})