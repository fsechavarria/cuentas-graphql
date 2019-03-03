import { Schema, model } from 'mongoose'

const businessSchema = new Schema({
  name: {
    type: String
  },
  bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }]
})

export default model('Business', businessSchema)
