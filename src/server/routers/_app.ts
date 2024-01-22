import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { procedure, router } from '../trpc'
import { db } from '../db'
import { biggerReactors } from '@/db/schema'
import { TRPCError } from '@trpc/server'
export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
  getBiggerReactorsReactor: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const reactor = await db.query.biggerReactors.findFirst({
        where: eq(biggerReactors.deviceId, input.id),
        with: { device: true },
      })

      // if (!reactor) {
      //   throw new TRPCError({
      //     code: 'BAD_REQUEST',
      //     message: `BiggerReactors_Reactor ${input.id} not found.`,
      //   })
      // }

      return reactor
    }),
  setBiggerReactorsReactor: procedure
    .input(z.object({ active: z.optional(z.boolean()) }))
    .mutation(async ({ input }) => {
      const reactor = await db.query.biggerReactors.findFirst({
        where: eq(biggerReactors.deviceId, 1),
        with: { device: true },
      })

      const ws = new WebSocket(
        `ws://localhost:8080/BiggerReactors_Reactor?dc=true`,
      )

      ws.addEventListener('open', () => {
        ws.send(JSON.stringify({ data: input, sentByDaemon: false }))
        ws.close()
      })
    }),
})
// export type definition of API
export type AppRouter = typeof appRouter
