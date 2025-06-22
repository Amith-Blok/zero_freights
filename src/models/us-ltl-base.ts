import mongoose, { InferSchemaType } from 'mongoose'

const usLtLBaseSchema = new mongoose.Schema(
  {
    fa_station: { type: String, required: true },
    market_zone: { type: String, required: true },
    zone: { type: String, required: true },
    min: { type: Number, required: true },
    cost: { type: Number, required: true },
  },
  {
    collection: 'us_ltl_base',
  }
)

const UsLtlBase =
  mongoose.models.us_ltl_base || mongoose.model('us_ltl_base', usLtLBaseSchema)
export type UsLtlBaseType = InferSchemaType<typeof usLtLBaseSchema>

export default UsLtlBase
