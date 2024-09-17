import { app } from './app'

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log(`HTTP server running! (http://localhost:3333/docs)`)
  })