import { env } from '@/env'
import { dayjs } from '@/lib/dayjs'
import { createTrip } from '@/service/create-trip'
import { getMailClient } from '@/lib/mail'
import nodemailer from 'nodemailer'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'


export const createTripRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        tags: ['trips'],
        summary: 'Create a new trip',
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          emails_to_invite: z.array(z.string().email()),
          owner_name: z.string(),
          owner_email: z.string().email(),
        }),
        response: {
          201: z.object({
            tripId: z.string().uuid(),
          }),
          400: z.object({ message: z.string() }).describe('Bad request'),
        },
      },
    },
    async (request, reply) => {
      const {
        starts_at,
        ends_at,
        destination,
        emails_to_invite,
        owner_name,
        owner_email,
      } = request.body

      if (dayjs(starts_at).isBefore(new Date())) {
        return reply.status(400).send({ message: 'Invalid trip start date.' })
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        return reply.status(400).send({ message: 'Invalid trip end date.' })
      }

      try {
        const trip = await createTrip({
          starts_at,
          ends_at,
          destination,
          emails_to_invite,
          owner_name,
          owner_email,
        })

        const mail = await getMailClient()

        const formattedTripStartDate = dayjs(starts_at).format('D[ de ]MMMM')
        const formattedTripEndDate = dayjs(ends_at).format('D[ de ]MMMM')

        const confirmationLink = new URL(
          `/trips/${trip.id}/confirm`,
          env.API_BASE_URL,
        )

        const message = await mail.sendMail({
          from: {
            name: 'Equipe plann.er',
            address: 'oi@plann.er',
          },
          to: {
            name: owner_name,
            address: owner_email,
          },
          subject: `Confirme sua viagem para ${destination} em ${formattedTripStartDate}`,
          html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de ${formattedTripStartDate} até ${formattedTripEndDate}.</p>
              <p></p>
              <p>Para confirmar sua viagem, clique no link abaixo:</p>
              <p></p>
              <p>
                <a href="${confirmationLink.toString()}">Confirmar viagem</a>
              </p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
          `.trim(),
        })

        console.log(nodemailer.getTestMessageUrl(message))

        return reply.status(201).send({
          tripId: trip.id,
        })
      } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' })
      }
    },
  )
}
