import Bill from '../models/bill'
import User from '../models/user'
import Business from '../models/business'
import { transformBill } from '../helpers/billHelper'
import { allowAdmin } from '../helpers/authHelper'

export const bill = async (parent, { _id }, { isAuth }) => {
  try {
    if (!isAuth) throw Error('Unauthorized')

    const result = await Bill.findById(_id).lean()
    return transformBill(result)
  } catch (err) {
    throw err.message
  }
}

export const bills = async (parent, args, { isAuth }) => {
  try {
    if (!isAuth) throw Error('Unauthorized')

    let result
    if (allowAdmin(isAuth)) {
      const _id = parent ? parent._id : args._id
      if (_id) {
        result = await Bill.find({ $or: [{ _id }, { owner: _id }, { business: _id }] }).lean()
      } else {
        result = await Bill.find({}).lean()
      }
    } else {
      const { _id } = isAuth
      result = await Bill.find({ owner: _id }).lean()
    }
    return result.map(bill => transformBill(bill))
  } catch (err) {
    throw err.message
  }
}

export const createBill = async (parent, { price, isPaid, paymentDate, business }, { isAuth }) => {
  try {
    if (!isAuth) throw Error('Unauthorized')

    const userId = isAuth
    const user = await User.findById(userId)
    if (!user) {
      throw Error('User does not exist')
    }

    const businessCheck = await Business.findById(business)
    if (!businessCheck) {
      throw Error('Business does not exist')
    }
    const data = { price, isPaid: isPaid && true, paymentDate, owner: user._id, business: businessCheck._id }
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

export const updateBill = async (parent, { _id, price, isPaid, paymentDate, business }, { isAuth }) => {
  try {
    if (!isAuth) throw Error('Unauthorized')

    const billCheck = await Bill.findById(_id)
    if (!billCheck) {
      throw Error('Bill does not exist')
    }

    let payDate
    if (!paymentDate && isPaid && !billCheck.paymentDate) {
      payDate = new Date()
    } else if (isPaid && paymentDate) {
      payDate = paymentDate
    } else {
      payDate = billCheck.paymentDate
    }

    const obj = {
      price: price ? price : billCheck.price,
      isPaid: isPaid ? isPaid : billCheck.isPaid,
      paymentDate: payDate,
      owner: billCheck.owner,
      updatedAt: new Date().toISOString()
    }

    if (business) {
      const businessCheck = await Business.findById(business)
      if (!businessCheck) {
        throw Error('Business does not exist')
      }
      obj.business = businessCheck._id
    }

    await Bill.updateOne({ _id }, obj)
    return 'Bill updated successfully'
  } catch (err) {
    throw err.message
  }
}

export const deleteBill = async (parent, { _id }, { isAuth }) => {
  try {
    if (!isAuth) throw Error('Unauthorized')

    const bill = await Bill.findById(_id)
    if (!bill) {
      throw Error('Bill does not exist')
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
