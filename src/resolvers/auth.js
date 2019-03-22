import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import axios from 'axios'

import User from '../models/user'

export const login = async (parent, { email, password }, { ip }) => {
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
    user.last_login_date = new Date().toISOString()
    user.last_login_ip = ip
    await axios
      .get(`${process.env.GEOLOCATION}`)
      .then(res => {
        user.last_login_location = `${res.data.country}, ${res.data.city}`
      })
      .catch(() => {})

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
