import mongoose, { InferSchemaType } from 'mongoose'

const usLtLAirportSchema = new mongoose.Schema(
  {
    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    airport_pickup_cost: { type: Number, required: true },
    delivery_cost: { type: Number, required: true },
    min_delivery_cost: { type: Number, required: true },
    cut_off_time: { type: Number, required: true },
    recovery: { type: Number, required: true },
    service_day: { type: Number, required: true },
  },
  {
    collection: 'us_ltl_airport',
  }
)

const UsLtlAirport =
  mongoose.models.us_ltl_airport ||
  mongoose.model('us_ltl_airport', usLtLAirportSchema)
export type UsLtlAirportType = InferSchemaType<typeof usLtLAirportSchema>

export default UsLtlAirport
