// import { trpc } from "../../../lib/trpc"
// import { zGetTransactionsTrpcInput } from "./input"

// export const getTransactionsTrpcRoute = trpc.procedure.input(zGetTransactionsTrpcInput).query(async ({ ctx, input }) => {
//   if (!ctx.me) {
//     throw new Error('UNAUTHORIZED')
//   }

//   const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, ' & ') : undefined
  
//   const whereClause: any = {
//     ownerId: ctx.me.id,
//   }
  
//   if (normalizedSearch) {
//     const searchNumber = Number(normalizedSearch)
//     const isNumber = !isNaN(searchNumber)
    
//     whereClause.OR = [
//       {
//         category: {
//           search: normalizedSearch,
//         },
//       },
//       {
//         comment: {
//           search: normalizedSearch,
//         },
//       },
//     ]
    
//     if (isNumber) {
//       whereClause.OR.push({
//         amount: {
//           equals: searchNumber,
//         }
//       })
//     }
//   }

//   const transactions = await ctx.prisma.transaction.findMany({
//     where: whereClause,
//     select: {
//       id: true,
//       type: true,
//       amount: true,
//       category: true,
//       date: true,
//       comment: true,
//       serialNumber: true
//     },
//     orderBy: [
//       {
//         date: 'desc',
//       },
//       {
//         serialNumber: 'desc',
//       },
//     ],
//     cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
//     take: input.limit + 1,
//   })
  
//   const nextTransaction = transactions.at(input.limit)
//   const nextCursor = nextTransaction?.serialNumber
//   const transactionsExceptNext = transactions.slice(0, input.limit)

//   return { transactions: transactionsExceptNext, nextCursor }
// })

import { trpc } from '../../../lib/trpc';
import { TRPCError } from '@trpc/server';
import { zGetTransactionsTrpcInput } from './input';

export const getTransactionsTrpcRoute = trpc.procedure
  .input(zGetTransactionsTrpcInput)
  .query(async ({ ctx, input }) => {
    if (!ctx.me) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const { cursor, limit, search, year, month, type } = input;

    let dateFilter = {};
    if (month !== undefined) {
      const now = new Date();
      const targetYear = year ?? now.getFullYear();
      dateFilter = {
        date: {
          gte: new Date(targetYear, month - 1, 1),
          lte: new Date(targetYear, month, 0, 23, 59, 59, 999),
        },
      };
    } else if (year !== undefined) {
      dateFilter = {
        date: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59, 999),
        },
      };
    }

    const normalizedSearch = search ? search.trim().replace(/[\s\n\t]/g, ' & ') : undefined;
    
    const where: any = {
      ownerId: ctx.me.id,
      ...dateFilter,
    };

    if (normalizedSearch) {
      const searchNumber = Number(normalizedSearch);
      const isNumber = !isNaN(searchNumber);
      
      where.OR = [
        { category: { search: normalizedSearch } },
        { comment: { search: normalizedSearch } },
      ];
      
      if (isNumber) {
        where.OR.push({ amount: { equals: searchNumber } });
      }
    }

    if (type) {
      where.type = type;
    }

    const transactions = await ctx.prisma.transaction.findMany({
      where,
      select: {
        id: true,
        type: true,
        amount: true,
        category: true,
        date: true,
        comment: true,
        serialNumber: true,
      },
      orderBy: [{ date: 'desc' }, { serialNumber: 'desc' }],
      cursor: cursor ? { serialNumber: cursor } : undefined,
      take: limit + 1,
    });

    const nextTransaction = transactions.at(limit);
    const nextCursor = nextTransaction?.serialNumber;
    const transactionsExceptNext = transactions.slice(0, limit);

    return { transactions: transactionsExceptNext, nextCursor };
  });