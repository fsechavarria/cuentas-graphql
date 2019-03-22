import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String },
  token: { type: String },
  bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }],
  last_login_date: { type: Date },
  last_login_ip: { type: String },
  last_login_location: { type: String }
})

export default model('User', userSchema)
