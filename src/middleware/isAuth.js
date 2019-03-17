import jwt from 'jsonwebtoken'

// TODO: query database for user and create role based route protection
export const authenticate = ({ headers }) => {
  const Authorization = headers.Authorization || headers.authorization

  if (Authorization && Authorization.length > 0) {
    const token = Authorization.replace('Bearer ', '')
    try {
      const { userId } = jwt.verify(token, process.env.SECRET)
      return userId
    } catch (err) {}
  }
  return false
}
