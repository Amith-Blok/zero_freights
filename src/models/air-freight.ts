import { ALL_COUNTRIES } from '@/constants'
import mongoose from 'mongoose'
const AirlineSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  currency: { type: String, required: true },
  transit_time: { type: Number, required: true }, //NOTE: transit time is in days
  value: { type: Number, required: true },
})
const AirFreightSchema = new mongoose.Schema(
  {
    start_code: {
      type: String,
      required: true,
    },
    end_code: {
      type: String,
      required: true,
    },
    port_country: {
      type: String,
      required: true,
      enum: ALL_COUNTRIES,
    },
    airlines: {
      type: [AirlineSchema],
      required: true,
    },
  },
  {
    collection: 'airfreight',
  }
)

export type AirFreightType = mongoose.InferSchemaType<typeof AirFreightSchema>
export type AirlineType = mongoose.InferSchemaType<typeof AirlineSchema>

export default mongoose.models.air_freight ||
  mongoose.model('air_freight', AirFreightSchema)
