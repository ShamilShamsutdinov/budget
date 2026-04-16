import _ from 'lodash'
import { trpcLoggedProcedure } from '../../../lib/trpc'

export const getMeTrpcRoute = trpcLoggedProcedure.query(({ ctx }) => {
  return { me: ctx.me && _.pick(ctx.me, ['id', 'nick']) }
})