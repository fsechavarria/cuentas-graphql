import DataLoader from 'dataloader'

import User from '../models/user'
import Bill from '../models/bill'
import Business from '../models/business'

const billLoader = new DataLoader(billIds => {
  return Bill.find({ _id: { $in: billIds } })
})

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } }).lean()
})

const businessLoader = new DataLoader(businessIds => {
  return Business.find({ _id: { $in: businessIds } }).lean()
})

const owner = async userId => {
  const user = await userLoader.load(userId.toString())
  return {
    ...user,
    bills: () => billLoader.loadMany(user.bills)
  }
}

export const business = async businessId => {
  const business = await businessLoader.load(businessId.toString())
  return {
    ...business,
    bills: () => billLoader.loadMany(business.bills)
  }
}

export const bills = async billsId => {
  const ids = billsId.map(id => id.toString())
  const bills = await billLoader.loadMany(ids)
  return bills.map(bill => {
    return transformBill(bill)
  })
}

export const transformBill = async bill => {
  return {
    ...bill,
    business: business.bind(this, bill.business),
    owner: owner.bind(this, bill.owner),
    paymentDate: bill.paymentDate ? new Date(bill.paymentDate).toISOString() : null,
    createdAt: new Date(bill.createdAt).toISOString(),
    updatedAt: bill.updatedAt ? new Date(bill.updatedAt).toISOString() : null
  }
}
