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

