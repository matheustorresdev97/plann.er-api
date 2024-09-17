import { getParticipantById } from '@/service/get-participant'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export const getTripParticipantsRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/participants/:participantId',
    {
      schema: {
        tags: ['participants'],
        summary: 'Get a trip participant details',
        params: z.object({
          participantId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            participant: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string().email(),
              is_confirmed: z.boolean(),
            }),
          }),
          400: z.object({ message: z.string() }).describe('Bad request'),
        },
      },
    },
    async (request, reply) => {
      const { participantId } = request.params

      try {
        const participant = await getParticipantById(participantId)

        if (!participant) {
          return reply.status(404).send({ message: 'Participant not found.' })
        }

        return { participant }
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
