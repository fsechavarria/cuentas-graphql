import Business from '../models/business'
import { transformBill } from './merge'
import { authenticate } from '../helpers/isAuth'

export const businesses = async (parent, { _id }, { req }) => {
  try {
    authenticate(req)
    let result
    if (_id) {
      result = [
        await Business.findById(_id)
          .populate('bills')
          .lean()
      ]
      if (result[0] === null) result = []
    } else {
      result = await Business.find()
        .populate('bills')
        .lean()
    }
    return result.map(business => {
      return {
        ...business,
        bills: business.bills.map(bill => transformBill(bill))
      }
    })
  } catch (err) {
    throw err.message
  }
}

export const createBusiness = async (parent, { name }, { req }) => {
  try {
    authenticate(req)
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

export const updateBusiness = async (parent, { _id, name }, { req }) => {
  try {
    authenticate(req)
    const checkBusiness = await Business.findById({ _id })
    if (!checkBusiness) {
      throw { message: 'Business not found' }
    }

    await Business.findOneAndUpdate({ _id }, { name: name ? name.trim() : checkBusiness.name })
    return 'Business updated successfully'
  } catch (err) {
    throw err.message
  }
}

export const deleteBusiness = async (parent, { _id }, { req }) => {
  try {
    authenticate(req)
    const result = await Business.findOneAndDelete({ _id })
    if (!result) {
      throw { message: 'Business not found' }
    }
    return 'Business deleted successfully'
  } catch (err) {
    throw err.message
  }
}
