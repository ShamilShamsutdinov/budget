import { trpcLoggedProcedure } from "../../../lib/trpc"
import { zCreateTransactionTrpcInput } from "./input"

export const deleteTransactionTrpcRoute = trpcLoggedProcedure
    .input(
      zCreateTransactionTrpcInput
    ) 
    .mutation(async ({ ctx, input }) => {
     if(!ctx.me){
       throw Error('NO_AUTHORIZATION')
     }
    
    const deletedTransaction = await ctx.prisma.transaction.delete({
        where: {
          id: input.id,
        }
    })

     return {deletedTransaction}
})