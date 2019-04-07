import jwt from 'jsonwebtoken'
import User from '../models/user'

export const authenticate = async ({ headers }) => {
  const Authorization = headers.Authorization || headers.authorization

  if (Authorization && Authorization.length > 0) {
    const token = Authorization.replace('Bearer ', '')
    try {
      const { userId } = jwt.verify(token, process.env.SECRET)
      const user = await User.findOne({ token }).lean()
      const _id = user._id.toString()
      if (!user || _id !== userId) {
        throw new Error()
      }
      return { _id, role: user.role }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') return true
      return false
    }
  }
  if (process.env.NODE_ENV === 'development') return true
  return false
}
