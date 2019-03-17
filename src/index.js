import { GraphQLServer } from 'graphql-yoga'
import mongoose from 'mongoose'

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

const context = req => ({
  isAuth: authenticate(req.request)
})

const server = new GraphQLServer({
  typeDefs: __dirname + '/schema/schema.graphql',
  resolvers,
  context
})

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    server.start(opts, ({ port }) => console.log(`Server is running on port ${port}`))
  })
  .catch(err => {
    console.log(err)
  })
