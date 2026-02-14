import { z } from 'zod'
import { zStringRequired } from '@budget/shared/src/zod'

export const zSignInTrpcInput = z.object({
  nick: zStringRequired,
  password: zStringRequired,
})