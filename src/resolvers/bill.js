import Bill from '../models/bill'
import User from '../models/user'
import Business from '../models/business'
import { transformBill } from './merge'
import { authenticate } from '../helpers/isAuth'

export const bills = async (parent, { _id }, { req }) => {
  authenticate(req)
  try {
    let result
    if (_id) {
      result = [await Bill.findById(_id)]
      if (result[0] === null) result = []
    } else {
      result = await Bill.find().lean()
    }
    return result.map(bill => transformBill(bill))
  } catch (err) {
    throw err.message
  }
}

export const createBill = async (
  parent,
  { price, isPaid, paymentDate, business },
  { req }
) => {
  const owner = authenticate(req)
  try {
    const user = await User.findById(owner)
    if (!user) {
      throw { message: 'User does not exist' }
    }
    const businessCheck = await Business.findById(business)
    if (!businessCheck) {
      throw { message: 'Business does not exist' }
    }

    const data = { price, isPaid: isPaid && true, paymentDate, owner, business }
    const bill = new Bill(data)
    const result = await bill.save()

    user.bills.push(bill)
    await user.save()

    businessCheck.bills.push(bill)
    await businessCheck.save()

    return transformBill(result._doc)
  } catch (err) {
    throw err.message
  }
}

export const updateBill = async (
  parent,
  { _id, price, isPaid, paymentDate, business },
  { req }
) => {
  const owner = authenticate(req)
  try {
    const billCheck = await Bill.findById(_id)
    if (!billCheck) {
      throw { message: 'Bill does not exist' }
    }
    await Bill.updateOne(
      { _id },
      {
        price,
        isPaid,
        paymentDate,
        owner,
        business,
        updatedAt: new Date().toISOString()
      }
    )

    return transformBill(billCheck._doc)
  } catch (err) {
    throw err.message
  }
}

export const deleteBill = async (parent, { _id }, { req }) => {
  authenticate(req)
  try {
    const bill = await Bill.findById({ _id })
    if (!bill) {
      throw { message: 'Bill does not exist' }
    }
    await Bill.deleteOne({ _id })
    const user = await User.findById(bill._doc.owner)
    const business = await Business.findById(bill._doc.business)
    user.bills.remove(_id)
    business.bills.remove(_id)

    await user.save()
    await business.save()
    return transformBill(bill._doc)
  } catch (err) {
    throw err.message
  }
}
