import { trpc } from "../../../lib/trpc"
import { z } from 'zod'

export const getTransactionTrpcRoute = trpc.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async({ input, ctx }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.id
        },
      }) 
      return { transaction: transaction }
})