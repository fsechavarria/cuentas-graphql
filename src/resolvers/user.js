import User from '../models/user'
import bcrypt from 'bcrypt'

import { authenticate } from '../helpers/isAuth'

export const createUser = async (parent, { email, password }, { req }) => {
  authenticate(req)
  try {
    const checkUser = await User.findOne({ email: email.trim() })
    if (checkUser) {
      throw { message: 'User already exists' }
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 15)
    const user = new User({ email, password: hashedPassword })
    const result = await user.save()
    return result._doc
  } catch (err) {
    throw err.message
  }
}

export const updateUser = async (parent, { email, password }, { req }) => {
  const _id = authenticate(req)
  try {
    const checkUser = await User.findOne({ email: email.trim() })
    if (!checkUser) {
      throw { message: 'User not found' }
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 15)
    const result = await User.findOneAndUpdate(
      { _id },
      { email: email.trim(), password: hashedPassword }
    )

    return result._doc
  } catch (err) {
    throw err.message
  }
}
