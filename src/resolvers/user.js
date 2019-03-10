import User from '../models/user'
import bcrypt from 'bcrypt'

import { authenticate } from '../helpers/isAuth'

export const createUser = async (parent, { email, password, role }, { req }) => {
  try {
    authenticate(req)
    const checkUser = await User.findOne({ email: email.trim() })
    if (checkUser) {
      throw { message: 'User already exists' }
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 15)
    const user = new User({
      email,
      password: hashedPassword,
      role: role ? role : 'user'
    })
    const result = await user.save()
    return result._doc
  } catch (err) {
    throw err.message
  }
}

export const updateUser = async (parent, { _id, email, password, role }, { req }) => {
  try {
    authenticate(req)
    const checkUser = await User.findById(_id)
    if (!checkUser) {
      throw { message: 'User not found' }
    }
    let hashedPassword
    let obj = {
      email: email ? email.trim() : checkUser.email,
      role: role ? role : checkUser.role
    }
    if (password) {
      hashedPassword = await bcrypt.hash(password.trim(), 15)
      obj.password = hashedPassword
    }
    await User.findByIdAndUpdate({ _id }, obj)

    return 'User updated successfully'
  } catch (err) {
    throw err.message
  }
}

export const deleteUser = async (parent, { _id }, { req }) => {
  try {
    authenticate(req)
    const checkUser = await User.findById(_id)
    if (!checkUser) {
      throw { message: 'User not found' }
    }
    await User.findByIdAndDelete(_id)
    return 'User deleted successfully'
  } catch (err) {
    throw err.message
  }
}
