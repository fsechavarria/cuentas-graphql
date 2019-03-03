import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user'

export const login = async (parent, { email, password }, { req }) => {
  try {
    const user = await User.findOne({ email }).lean()

    if (!user) {
      throw { message: 'Incorrect email or password.' }
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw { message: 'Incorrect email or password.' }
    }

    return {
      token: jwt.sign({ userId: user._id.toString() }, process.env.SECRET),
      userId: user._id,
      email: user.email
    }
  } catch (err) {
    throw err.message
  }
}
