import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './errors'
import { confirmTripRoutes } from './routes/confirm-trip'
import { confirmParticipantRoutes } from '@/service/confirm-participant'
import { createInviteRoutes } from './routes/create-invite'
import { createTripActivityRoutes } from './routes/create-trip-activity'
import { createTripLinkRoutes } from './routes/create-trip-link'
import { createTripRoutes } from './routes/create-trip'
import { getTripActivitiesRoutes } from './routes/get-trip-activities'
import { getTripDetailsRoutes } from './routes/get-trip-details'
import { getTripLinksRoutes } from './routes/get-trip-links'
import { getTripParticipantsRoutes } from './routes/get-trip-participants'
import { updateTripRoutes } from './routes/update-trip'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'plann.er',
            description:
                'Especificações da API para o back-end da aplicação plann.er',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
})

app.register(fastifyCors, {
    origin: '*',
    credentials: true,
})

app.setErrorHandler(errorHandler)

app.register(confirmTripRoutes)
app.register(confirmParticipantRoutes)
app.register(createInviteRoutes)
app.register(createTripActivityRoutes)
app.register(createTripLinkRoutes)
app.register(createTripRoutes)
app.register(getTripActivitiesRoutes)
app.register(getTripDetailsRoutes)
app.register(getTripLinksRoutes)
app.register(getTripParticipantsRoutes)
app.register(updateTripRoutes)