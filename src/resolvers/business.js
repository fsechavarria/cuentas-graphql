import Business from '../models/business'
import { transformBill } from './merge'
import { authenticate } from '../helpers/isAuth'

export const businesses = async (parent, { _id }, { req }) => {
  authenticate(req)
  try {
    let result
    if (_id) {
      result = [await Business.findById(_id)]
      if (result[0] === null) result = []
    } else {
      result = await Business.find().lean()
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
  authenticate(req)
  try {
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
  authenticate(req)
  try {
    const checkBusiness = await Business.findById({ _id })
    if (!checkBusiness) {
      throw { message: 'Business not found' }
    }

    const result = await Business.findOneAndUpdate(
      { _id },
      { name: name.trim() }
    )
    return result._doc
  } catch (err) {
    throw err.message
  }
}

export const deleteBusiness = async (parent, { _id }, { req }) => {
  authenticate(req)
  try {
    const result = await Business.findOneAndDelete({ _id })
    if (!result) {
      throw { message: 'Business not found' }
    }
    return result._doc
  } catch (err) {
    throw err.message
  }
}
