'use strict'
import jwt from 'jsonwebtoken'

export const authenticate = ({ headers }) => {
  const Authorization = headers.Authorization || headers.authorization

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    try {
      const { userId } = jwt.verify(token, process.env.SECRET)
      return userId
    } catch (err) {
      throw new Error('Unauthorized')
    }
  }

  throw new Error('Unauthorized')
}
