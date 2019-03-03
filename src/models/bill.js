import { Schema, model } from 'mongoose'

const billSchema = new Schema({
  price: { type: Number },
  isPaid: { type: Boolean, default: false },
  paymentDate: { type: Date, default: null },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  business: { type: Schema.Types.ObjectId, ref: 'Business' },
  createdAt: {
    type: Date,
    default: new Date().toISOString()
  },
  updatedAt: {
    type: Date,
    default: null
  }
})

export default model('Bill', billSchema)
