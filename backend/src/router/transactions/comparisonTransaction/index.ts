import { trpc } from "../../../lib/trpc"
import { zComparisonTransactionTrpcInput } from "./input"
import { TRPCError } from "@trpc/server"

export const comparisonTransactionTrpcRoute = trpc.procedure
    .input(zComparisonTransactionTrpcInput)
    .query(async ({ ctx, input }) => {
        if (!ctx.me) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'NO_AUTHORIZATION',
            })
        }

        const userId = ctx.me.id
        const now = new Date()

        // Текущий месяц
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

        // Предыдущий месяц
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

        // Получаем статистику за текущий месяц через groupBy
        const currentStats = await ctx.prisma.transaction.groupBy({
            by: ['type'],
            where: {
                ownerId: userId,
                date: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                },
            },
            _sum: {
                amount: true,
            },
        })

        // Получаем статистику за предыдущий месяц через groupBy
        const prevStats = await ctx.prisma.transaction.groupBy({
            by: ['type'],
            where: {
                ownerId: userId,
                date: {
                    gte: prevMonthStart,
                    lte: prevMonthEnd,
                },
            },
            _sum: {
                amount: true,
            },
        })

        // Достаём суммы из результатов
        const currentIncome = currentStats.find(s => s.type === 'Доход')?._sum.amount ?? 0
        const currentExpense = currentStats.find(s => s.type === 'Расход')?._sum.amount ?? 0
        
        const prevIncome = prevStats.find(s => s.type === 'Доход')?._sum.amount ?? 0
        const prevExpense = prevStats.find(s => s.type === 'Расход')?._sum.amount ?? 0

        // Баланс за текущий месяц
        const balance = currentIncome - currentExpense
        
        // Процент изменения дохода
        const incomeChangePercent = prevIncome === 0 
            ? currentIncome > 0 ? 100 : 0
            : ((currentIncome - prevIncome) / prevIncome) * 100
        
        // Процент изменения расхода
        const expenseChangePercent = prevExpense === 0
            ? currentExpense > 0 ? 100 : 0
            : ((currentExpense - prevExpense) / prevExpense) * 100

        // Формируем названия месяцев
        const monthNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
        const currentMonthName = monthNames[now.getMonth()]
        const prevMonthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1
        const prevMonthName = monthNames[prevMonthIndex]
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

        return {
            current: {
                income: currentIncome,
                expense: currentExpense,
                balance: balance,
            },
            previous: {
                income: prevIncome,
                expense: prevExpense,
            },
            changes: {
                income: {
                    absolute: currentIncome - prevIncome,
                    percent: Number(incomeChangePercent.toFixed(1)),
                    trend: currentIncome > prevIncome ? 'up' : currentIncome < prevIncome ? 'down' : 'same',
                },
                expense: {
                    absolute: currentExpense - prevExpense,
                    percent: Number(expenseChangePercent.toFixed(1)),
                    trend: currentExpense > prevExpense ? 'up' : currentExpense < prevExpense ? 'down' : 'same',
                },
            },
            period: {
                current: {
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                    label: `${currentMonthName} ${now.getFullYear()}`,
                },
                previous: {
                    month: prevMonthIndex + 1,
                    year: prevYear,
                    label: `${prevMonthName} ${prevYear}`,
                },
            },
        }
    })