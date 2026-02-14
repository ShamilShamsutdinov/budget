// import { trpc } from "../../../lib/trpc"
// import { zComparisonTransactionTrpcInput } from "./input"
// import { TRPCError } from "@trpc/server"

// export const comparisonTransactionTrpcRoute = trpc.procedure
//     .input(zComparisonTransactionTrpcInput)
//     .query(async ({ ctx, input }) => {
//         if (!ctx.me) {
//             throw new TRPCError({
//                 code: 'UNAUTHORIZED',
//                 message: 'NO_AUTHORIZATION',
//             })
//         }

//         const userId = ctx.me.id
//         const now = new Date()

//         // Текущий месяц
//         const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
//         const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

//         // Предыдущий месяц
//         const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
//         const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

//         // Получаем статистику за текущий месяц через groupBy
//         const currentStats = await ctx.prisma.transaction.groupBy({
//             by: ['type'],
//             where: {
//                 ownerId: userId,
//                 date: {
//                     gte: currentMonthStart,
//                     lte: currentMonthEnd,
//                 },
//             },
//             _sum: {
//                 amount: true,
//             },
//         })

//         // Получаем статистику за предыдущий месяц через groupBy
//         const prevStats = await ctx.prisma.transaction.groupBy({
//             by: ['type'],
//             where: {
//                 ownerId: userId,
//                 date: {
//                     gte: prevMonthStart,
//                     lte: prevMonthEnd,
//                 },
//             },
//             _sum: {
//                 amount: true,
//             },
//         })

//         // Достаём суммы из результатов
//         const currentIncome = currentStats.find(s => s.type === 'Доход')?._sum.amount ?? 0
//         const currentExpense = currentStats.find(s => s.type === 'Расход')?._sum.amount ?? 0
        
//         const prevIncome = prevStats.find(s => s.type === 'Доход')?._sum.amount ?? 0
//         const prevExpense = prevStats.find(s => s.type === 'Расход')?._sum.amount ?? 0

//         // Баланс за текущий месяц
//         const balance = currentIncome - currentExpense
        
//         // Процент изменения дохода
//         const incomeChangePercent = prevIncome === 0 
//             ? currentIncome > 0 ? 100 : 0
//             : ((currentIncome - prevIncome) / prevIncome) * 100
        
//         // Процент изменения расхода
//         const expenseChangePercent = prevExpense === 0
//             ? currentExpense > 0 ? 100 : 0
//             : ((currentExpense - prevExpense) / prevExpense) * 100

//         // Формируем названия месяцев
//         const monthNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
//         const currentMonthName = monthNames[now.getMonth()]
//         const prevMonthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1
//         const prevMonthName = monthNames[prevMonthIndex]
//         const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

//         return {
//             current: {
//                 income: currentIncome,
//                 expense: currentExpense,
//                 balance: balance,
//             },
//             previous: {
//                 income: prevIncome,
//                 expense: prevExpense,
//             },
//             changes: {
//                 income: {
//                     absolute: currentIncome - prevIncome,
//                     percent: Number(incomeChangePercent.toFixed(1)),
//                     trend: currentIncome > prevIncome ? 'up' : currentIncome < prevIncome ? 'down' : 'same',
//                 },
//                 expense: {
//                     absolute: currentExpense - prevExpense,
//                     percent: Number(expenseChangePercent.toFixed(1)),
//                     trend: currentExpense > prevExpense ? 'up' : currentExpense < prevExpense ? 'down' : 'same',
//                 },
//             },
//             period: {
//                 current: {
//                     month: now.getMonth() + 1,
//                     year: now.getFullYear(),
//                     label: `${currentMonthName} ${now.getFullYear()}`,
//                 },
//                 previous: {
//                     month: prevMonthIndex + 1,
//                     year: prevYear,
//                     label: `${prevMonthName} ${prevYear}`,
//                 },
//             },
//         }
//     })

import { trpc } from "../../../lib/trpc"
import { TRPCError } from '@trpc/server';
import { zGetPeriodComparisonTrpcInput } from './input';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
  format,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import z from "zod";

export const getPeriodComparisonTrpcRoute = trpc.procedure
  .input(zGetPeriodComparisonTrpcInput)
  .query(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'NO_AUTHORIZATION' });
    }

     const userId = ctx.me.id;

    // Вспомогательная функция для получения сумм за период
    const getTotals = async (start: Date, end: Date) => {
      const stats = await ctx.prisma.transaction.groupBy({
        by: ['type'],
        where: {
          ownerId: userId,
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
      });

      const income = stats.find((s) => s.type === 'Доход')?._sum.amount ?? 0;
      const expense = stats.find((s) => s.type === 'Расход')?._sum.amount ?? 0;
      return { income, expense, balance: income - expense };
    };

    // Определяем текущий и предыдущий периоды
    const now = new Date();
    let currentStart: Date, currentEnd: Date;
    let previousStart: Date, previousEnd: Date;
    let previousExists = true;

    // Случай 1: Выбран конкретный месяц (и опционально год)
    if (input.month !== undefined) {
      const year = input.year ?? now.getFullYear();
      currentStart = startOfMonth(new Date(year, input.month - 1, 1));
      currentEnd = endOfMonth(new Date(year, input.month - 1, 1));

      // Предыдущий месяц
      const prevDate = subMonths(new Date(year, input.month - 1, 1), 1);
      previousStart = startOfMonth(prevDate);
      previousEnd = endOfMonth(prevDate);
    }
    // Случай 2: Выбран только год (без месяца)
    else if (input.year !== undefined) {
      currentStart = startOfYear(new Date(input.year, 0, 1));
      currentEnd = endOfYear(new Date(input.year, 0, 1));

      // Предыдущий год
      const prevDate = subYears(new Date(input.year, 0, 1), 1);
      previousStart = startOfYear(prevDate);
      previousEnd = endOfYear(prevDate);
    }
    // Случай 3: Используем period
    else {
      switch (input.period) {
        case 'week':
          currentStart = startOfWeek(now, { weekStartsOn: 1 }); // Понедельник
          currentEnd = endOfWeek(now, { weekStartsOn: 1 });
          previousStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
          previousEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
          break;
        case 'month':
          currentStart = startOfMonth(now);
          currentEnd = endOfMonth(now);
          previousStart = startOfMonth(subMonths(now, 1));
          previousEnd = endOfMonth(subMonths(now, 1));
          break;
        case 'all':
          // Всё время — нет предыдущего периода
          const allTransactions = await ctx.prisma.transaction.findMany({
            where: { ownerId: ctx.me.id },
            select: { type: true, amount: true },
          });
          let allIncome = 0,
            allExpense = 0;
          allTransactions.forEach((t) => {
            if (t.type === 'Доход') allIncome += t.amount;
            else allExpense += t.amount;
          });
          const allBalance = allIncome - allExpense;
          return {
            current: {
              income: allIncome,
              expense: allExpense,
              balance: allBalance,
            },
            previous: null,
            changes: null,
            period: {
              current: { label: 'Всё время' },
              previous: null,
            },
          };
        default:
          throw new TRPCError({ code: 'BAD_REQUEST' });
      }
    }

    // Получаем данные для обоих периодов
    const [current, previous] = await Promise.all([
      getTotals(currentStart, currentEnd),
      previousExists ? getTotals(previousStart, previousEnd) : Promise.resolve({ income: 0, expense: 0, balance: 0 }),
    ]);

    // Вычисляем изменения
    const incomeChangeAbsolute = current.income - previous.income;
    const expenseChangeAbsolute = current.expense - previous.expense;
    const balanceChangeAbsolute = current.balance - previous.balance;

    const incomeChangePercent =
      previous.income === 0
        ? current.income > 0
          ? 100
          : 0
        : (incomeChangeAbsolute / previous.income) * 100;
    const expenseChangePercent =
      previous.expense === 0
        ? current.expense > 0
          ? 100
          : 0
        : (expenseChangeAbsolute / previous.expense) * 100;

    // Формируем читаемые метки
    const currentLabel = formatPeriod(input, currentStart, currentEnd, 'current');
    const previousLabel = formatPeriod(input, previousStart, previousEnd, 'previous');

    return {
      current,
      previous,
      changes: {
        income: {
          absolute: incomeChangeAbsolute,
          percent: Number(incomeChangePercent.toFixed(1)),
          trend: incomeChangeAbsolute > 0 ? 'up' : incomeChangeAbsolute < 0 ? 'down' : 'same',
        },
        expense: {
          absolute: expenseChangeAbsolute,
          percent: Number(expenseChangePercent.toFixed(1)),
          trend: expenseChangeAbsolute > 0 ? 'up' : expenseChangeAbsolute < 0 ? 'down' : 'same',
        },
        balance: {
          absolute: balanceChangeAbsolute,
        },
      },
      period: {
        current: { label: currentLabel },
        previous: { label: previousLabel },
      },
    };
  });

// Вспомогательная функция для форматирования меток
function formatPeriod(
  input: z.infer<typeof zGetPeriodComparisonTrpcInput>,
  start: Date,
  end: Date,
  type: 'current' | 'previous'
): string {
  if (input.month !== undefined) {
    const year = input.year ?? new Date().getFullYear();
    const monthIndex = type === 'current' ? input.month - 1 : input.month - 2;
    const adjustedYear = type === 'current' ? year : input.month === 1 ? year - 1 : year;
    const date = new Date(adjustedYear, monthIndex, 1);
    return format(date, 'LLLL yyyy', { locale: ru });
  }

  if (input.year !== undefined) {
    const year = type === 'current' ? input.year : input.year - 1;
    return `${year} год`;
  }

  switch (input.period) {
    case 'week':
      return `${format(start, 'd MMM', { locale: ru })} – ${format(end, 'd MMM yyyy', { locale: ru })}`;
    case 'month':
      return format(start, 'LLLL yyyy', { locale: ru });
    case 'all':
      return 'Всё время';
    default:
      return '';
  }
}