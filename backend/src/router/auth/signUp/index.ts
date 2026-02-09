import { trpc } from '../../../lib/trpc'
import { zSignUpTrpcInput } from './input'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { sendWelcomeEmail } from '../../../lib/emails'

export const signUpTrpcRoute = trpc.procedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUser = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exUser) {
    throw new Error('Пользователь с таким ником уже существует')
  }
  const exEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })
  if (exEmail) {
    throw new Error('Пользователь с таким email уже существует')
  }
  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: getPasswordHash(input.password),
    },
  })
  void sendWelcomeEmail({ user })
  const token = signJWT(user.id)
  return {token}
})