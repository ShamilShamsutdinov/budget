import { trpcLoggedProcedure } from "../../../lib/trpc"
import { zCreateTransactionTrpcInput } from "./input"


export const createTransactionTrpcRoute = trpcLoggedProcedure
    .input(
      zCreateTransactionTrpcInput
    ) 
    .mutation(async ({ ctx, input }) => {
     if(!ctx.me){
       throw Error('NO_AUTHORIZATION')
     }
    
    const newTransaction = await ctx.prisma.transaction.create({
      data: {
        type: input.type,
        amount: input.amount, 
        category: input.category,
        date: new Date(input.date),
        comment: input.comment || null, 
        ownerId: ctx.me.id
      },
    })

    return {newTransaction}
})