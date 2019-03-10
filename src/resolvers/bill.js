import Bill from '../models/bill'
import User from '../models/user'
import Business from '../models/business'
import { transformBill } from './merge'
import { authenticate } from '../helpers/isAuth'

export const bills = async (parent, { _id }, { req }) => {
  try {
    authenticate(req)
    let result
    if (_id) {
      result = [await Bill.findById(_id).lean()]
      if (result[0] === null) result = []
    } else {
      result = await Bill.find().lean()
    }
    return result.map(bill => transformBill(bill))
  } catch (err) {
    throw err.message
  }
}

export const createBill = async (parent, { price, isPaid, paymentDate, business }, { req }) => {
  try {
    const owner = authenticate(req)
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
    user.bills.push(bill)
    businessCheck.bills.push(bill)

    const result = await bill.save()
    await user.save()
    await businessCheck.save()
    return await transformBill(result._doc)
  } catch (err) {
    throw err.message
  }
}

export const updateBill = async (parent, { _id, price, isPaid, paymentDate, business }, { req }) => {
  try {
    authenticate(req)
    const billCheck = await Bill.findById(_id)
    if (!billCheck) {
      throw { message: 'Bill does not exist' }
    }
    let payDate
    if (!paymentDate && isPaid && !billCheck.paymentDate) {
      payDate = new Date()
    } else if (isPaid && paymentDate) {
      payDate = paymentDate
    } else {
      payDate = billCheck.paymentDate
    }

    await Bill.updateOne(
      { _id },
      {
        price: price ? price : billCheck.price,
        isPaid: isPaid ? isPaid : billCheck.isPaid,
        paymentDate: payDate,
        owner: billCheck.owner,
        business: business ? business : billCheck.business,
        updatedAt: new Date().toISOString()
      }
    )

    return 'Bill updated successfully'
  } catch (err) {
    throw err.message
  }
}

export const deleteBill = async (parent, { _id }, { req }) => {
  try {
    authenticate(req)
    const bill = await Bill.findById(_id)
    if (!bill) {
      throw { message: 'Bill does not exist' }
    }
    if (bill.owner) {
      const user = await User.findById(bill.owner)
      user.bills.remove(_id)
      await user.save()
    }
    if (bill.business) {
      const business = await Business.findById(bill.business)
      business.bills.remove(_id)
      await business.save()
    }
    await Bill.findByIdAndDelete(_id)
    return 'Bill deleted successfully'
  } catch (err) {
    throw err.message
  }
}
