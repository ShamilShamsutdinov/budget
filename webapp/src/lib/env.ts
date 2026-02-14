import { z } from 'zod'
import { zEnvNonemptyTrimmed } from '../../../shared/src/zod'

export const zEnv = z.object({
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
})

export const env = zEnv.parse(process.env)