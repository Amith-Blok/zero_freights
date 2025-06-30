import mongoose from 'mongoose'
export const LocationSchema = new mongoose.Schema(
  {
    code: { type: String, required: false },
    name: { type: String, require: true },
    type: {
      type: String,
      enum: ['door', 'port', 'rail', 'air', 'warehouse'],
      required: true,
    },
  },
  {
    _id: false,
  }
)
