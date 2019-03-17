import Business from '../models/business'

export const business = async (parent, args, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const _id = parent ? parent.business : args._id
    const result = await Business.findById(_id).lean()
    return result
  } catch (err) {
    throw err.message
  }
}

export const businesses = async (parent, args, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const { _id } = args
    if (_id) {
      return await Business.findById(_id).lean()
    }
    return await Business.find({}).lean()
  } catch (err) {
    throw err.message
  }
}

export const createBusiness = async (parent, { name }, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const businessCheck = await Business.findOne({
      name: { $regex: name, $options: 'ig' }
    })
    if (businessCheck) {
      throw { message: `Business ${name} already exists` }
    }
    const business = new Business({ name: name.trim() })
    const result = await business.save()
    return result._doc
  } catch (err) {
    throw err.message
  }
}

export const updateBusiness = async (parent, { _id, name }, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const checkBusiness = await Business.findById({ _id })
    if (!checkBusiness) {
      throw Error('Business not found')
    }

    await Business.findOneAndUpdate({ _id }, { name: name ? name.trim() : checkBusiness.name })
    return 'Business updated successfully'
  } catch (err) {
    throw err.message
  }
}

export const deleteBusiness = async (parent, { _id }, context) => {
  try {
    if (!context.isAuth) throw Error('Unauthorized')

    const result = await Business.findOneAndDelete({ _id })
    if (!result) {
      throw Error('Business not found')
    }
    return 'Business deleted successfully'
  } catch (err) {
    throw err.message
  }
}
