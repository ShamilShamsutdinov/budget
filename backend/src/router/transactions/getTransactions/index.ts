import { trpc } from "../../../lib/trpc"
import { zGetTransactionsTrpcInput } from "./input"

export const getTransactionsTrpcRoute = trpc.procedure.input(zGetTransactionsTrpcInput).query(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }

  const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, ' & ') : undefined
  
  const whereClause: any = {
    ownerId: ctx.me.id,
  }
  
  if (normalizedSearch) {
    const searchNumber = Number(normalizedSearch)
    const isNumber = !isNaN(searchNumber)
    
    whereClause.OR = [
      {
        category: {
          search: normalizedSearch,
        },
      },
      {
        comment: {
          search: normalizedSearch,
        },
      },
    ]
    
    if (isNumber) {
      whereClause.OR.push({
        amount: {
          equals: searchNumber,
        }
      })
    }
  }

  const transactions = await ctx.prisma.transaction.findMany({
    where: whereClause,
    select: {
      id: true,
      type: true,
      amount: true,
      category: true,
      date: true,
      comment: true,
      serialNumber: true
    },
    orderBy: [
      {
        date: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })
  
  const nextTransaction = transactions.at(input.limit)
  const nextCursor = nextTransaction?.serialNumber
  const transactionsExceptNext = transactions.slice(0, input.limit)

  return { transactions: transactionsExceptNext, nextCursor }
})