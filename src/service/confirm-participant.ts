import { env } from "@/env"
import { getParticipantById, updateParticipant } from "@/http/routes/confirm-participant"

import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export const confirmParticipantRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/participants/:participantId/confirm",
    {
      schema: {
        tags: ["participants"],
        summary: "Confirms a participant on a trip.",
        params: z.object({
          participantId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          204: z.null(),
          400: z.object({ message: z.string() }).describe("Bad request"),
        },
      },
    },
    async (request, reply) => {
      const { participantId } = request.params
      const { name, email } = request.body

      const participant = await getParticipantById(participantId)

      if (!participant) {
        return reply.status(400).send({ message: "Participant not found." })
      }

      await updateParticipant(participantId, name)

      // Construct the URL for the trip details
      const tripDetailsURL = new URL(
        `/trips/${participant.trip_id}`,
        env.WEB_BASE_URL
      )

      // Optionally redirect or just respond with 204
      // return reply.redirect(tripDetailsURL.toString())
      return reply.status(204).send()
    }
  )
}
