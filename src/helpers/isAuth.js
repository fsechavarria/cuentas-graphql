'use strict'
import jwt from 'jsonwebtoken'

export const authenticate = ({ headers }) => {
  const Authorization = headers.Authorization

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.SECRET)
    return userId
  }

  throw new Error('Unauthorized')
}
