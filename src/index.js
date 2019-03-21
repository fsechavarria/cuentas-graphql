import { GraphQLServer } from 'graphql-yoga'
import mongoose from 'mongoose'
import requestIp from 'request-ip'

import { authenticate } from '../src/middleware/isAuth'

require('dotenv').config()

import resolvers from './resolvers'

const opts = {
  port: process.env.PORT || 3001,
  endpoint: '/graphql',
  cors: {
    credentials: true,
    origin: ['http://localhost:8000', 'http://localhost:3000']
  }
}

const context = async ({ request }) => {
  return {
    isAuth: await authenticate(request),
    ip: requestIp.getClientIp(request)
  }
}

const server = new GraphQLServer({
  typeDefs: __dirname + '/schema/schema.graphql',
  resolvers,
  context
})

const app = async () =>
  await mongoose
    .connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => {
      return server.start(opts, ({ port }) =>
        console.log(`\nServer is running on port ${port} \n\nRunning Enviornment: ${process.env.NODE_ENV}\n\n`)
      )
    })
    .catch(err => {
      console.log(err)
    })

module.exports = app()
