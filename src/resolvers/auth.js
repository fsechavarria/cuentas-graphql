import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user'

export const login = async (parent, { email, password }, context) => {
  try {
    const user = await User.findOne({ email })

    if (!user) {
      throw { message: 'Incorrect email or password.' }
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw { message: 'Incorrect email or password.' }
    }

    const token = jwt.sign({ userId: user._id.toString() }, process.env.SECRET, { expiresIn: '1h' })
    user.token = token
    await user.save()

    return {
      token,
      userId: user._id,
      email: user.email,
      role: user.role
    }
  } catch (err) {
    throw err.message
  }
}
