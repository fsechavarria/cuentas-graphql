import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String },
  bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }]
})

export default model('User', userSchema)
