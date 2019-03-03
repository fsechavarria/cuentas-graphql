import {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  businesses
} from './business'

import { bills, createBill, updateBill, deleteBill } from './bill'

import { createUser, updateUser } from './user'

import { login } from './auth'

export default {
  Mutation: {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    createUser,
    updateUser,
    createBill,
    updateBill,
    deleteBill
  },
  Query: { login, businesses, bills }
}
