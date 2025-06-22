import mongoose, { InferSchemaType } from 'mongoose'

const usLtLCitiesSchema = new mongoose.Schema(
  {
    zipcode: { type: String, required: true },
    place_id: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'US' },
    zone: { type: String, required: true },
    fa_station: { type: String, required: true },
    cartage_schedule: { type: Number, required: true },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: { type: [Number], required: true },
    },
  },
  {
    collection: 'us_ltl_cities',
  }
)

const UsLtlCities =
  mongoose.models.UsLtlCities ||
  mongoose.model('UsLtlCities', usLtLCitiesSchema)
export type UsLtlCitiesType = InferSchemaType<typeof usLtLCitiesSchema>

export default UsLtlCities
