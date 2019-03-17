import User from '../models/user'
import bcrypt from 'bcrypt'

export const user = async (parent, args, context) => {
  try {
    // if (!context.isAuth) throw Error('Unauthorized')

    const _id = parent ? parent.owner : args._id
    return await User.findById(_id).lean()
  } catch (err) {
    throw err.message
  }
}

export const users = async (parent, args, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    return await User.find({}).lean()
  } catch (err) {
    throw err.message
  }
}

export const createUser = async (parent, { email, password, role }, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const checkUser = await User.findOne({ email: { $regex: email.trim(), $options: 'ig' } })
    if (checkUser) {
      throw Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 15)
    const user = new User({
      email: email.trim(),
      password: hashedPassword,
      role: role ? role : 'user'
    })
    const result = await user.save()
    return result._doc
  } catch (err) {
    throw err.message
  }
}

export const updateUser = async (parent, { _id, email, password, role }, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const checkUser = await User.findById(_id)
    if (!checkUser) {
      throw Error('User not found')
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

export const deleteUser = async (parent, { _id }, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const checkUser = await User.findById(_id)
    if (!checkUser) {
      throw Error('User not found')
    }
    await User.findByIdAndDelete(_id)
    return 'User deleted successfully'
  } catch (err) {
    throw err.message
  }
}
