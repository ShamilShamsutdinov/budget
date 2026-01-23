import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { trpcRouter } from './router/index'
import cors from 'cors'
import { applyTrpcToExpressApp } from './lib/trpc'
import { AppContext, createAppContext } from './lib/ctx'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    const expressApp = express()
    expressApp.use(cors())
    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })
    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    expressApp.listen(3000, () => {
      console.info('Listening at http://localhost:3000')
    })
  } catch (error) {
    console.error(error)
    await ctx?.stop()
  }
})()