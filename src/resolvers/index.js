import { createBusiness, updateBusiness, deleteBusiness, businesses, business } from './business'

import { bill, bills, createBill, updateBill, deleteBill } from './bill'

import { user, users, createUser, updateUser, deleteUser } from './user'

import { login } from './auth'

export default {
  Mutation: {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    createUser,
    updateUser,
    deleteUser,
    createBill,
    updateBill,
    deleteBill
  },
  Query: { login, user, users, business, businesses, bill, bills },
  Bill: {
    business,
    owner: user
  },
  Business: {
    bills
  },
  User: {
    bills
  }
}
