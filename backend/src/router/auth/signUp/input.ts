import { zEmailRequired, zStringRequired } from '@budget/shared/src/zod'
import { z } from 'zod'

export const zSignUpTrpcInput = z.object({
  nick: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Nick may contain only lowercase letters, numbers and dashes'),
  email: zEmailRequired,
  password: zStringRequired,
})