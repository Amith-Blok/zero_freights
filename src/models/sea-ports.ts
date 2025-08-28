import mongoose, { InferSchemaType } from 'mongoose'

const NearestPortsSchema = new mongoose.Schema({
  port_code: { type: String, required: false },
  port_name: { type: String, required: false },
})

const SeaPortsSchema = new mongoose.Schema(
  {
    port_name: {
      type: String,
      required: true,
    },
    port_code: {
      type: String,
      required: true,
    },
    place_id: {
      type: String,
      required: true,
    },
    port_country: String,
    port_type: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    port_address: {
      type: String,
      required: false,
    },
    port_region: {
      type: String,
      required: false,
    },
    haulage_type: { type: String, required: false },
    nearest_ports: { type: [NearestPortsSchema], required: false },
  },
  {
    collection: 'seaports',
  }
)
export type SeaPortsType = InferSchemaType<typeof SeaPortsSchema>

export default mongoose.models.seaports ||
  mongoose.model('seaports', SeaPortsSchema)
