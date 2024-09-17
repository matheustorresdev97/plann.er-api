import { createActivity } from '@/service/create-trip-activity'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export const createTripActivityRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/activities',
    {
      schema: {
        tags: ['activities'],
        summary: 'Create a trip activity.',
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          occurs_at: z.coerce.date(),
          title: z.string(),
        }),
        response: {
          201: z.object({
            activityId: z.string().uuid(),
          }),
          400: z.object({ message: z.string() }).describe('Bad request'),
        },
      },
    },
    async (request, reply) => {
      const { tripId } = request.params
      const { title, occurs_at } = request.body

      try {
        const activity = await createActivity(tripId, title, occurs_at)
        return reply.status(201).send({ activityId: activity.id })
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
