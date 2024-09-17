import { createTripLink } from '@/service/create-trip-link'
import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export const createTripLinkRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/links',
    {
      schema: {
        tags: ['links'],
        summary: 'Create a trip link.',
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string(),
          url: z.string().url(),
        }),
        response: {
          201: z.object({
            linkId: z.string().uuid(),
          }),
          400: z.object({ message: z.string() }).describe('Bad request'),
        },
      },
    },
    async (request, reply) => {
      const { tripId } = request.params
      const { title, url } = request.body

      try {
        const link = await createTripLink({ tripId, title, url })
        return reply.status(201).send({ linkId: link.id })
      } catch (error) {
        console.error('Error creating link:', error)
        return reply.status(400).send({ message: 'Error creating link' })
      }
    },
  )
}
