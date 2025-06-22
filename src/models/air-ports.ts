import mongoose, { InferSchemaType } from 'mongoose'

const AirPortsSchema = new mongoose.Schema(
  {
    port_name: { type: String, required: true },
    port_code: { type: String, required: true },
    place_id: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point' },
      country: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    port_type: { type: String, default: 'AIRPORT' },
  },
  {
    collection: 'airports',
  }
)

export type AirPortsType = InferSchemaType<typeof AirPortsSchema>
export default mongoose.models.airports ||
  mongoose.model('airports', AirPortsSchema)
