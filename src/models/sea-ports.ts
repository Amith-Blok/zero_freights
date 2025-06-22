import mongoose, { InferSchemaType } from 'mongoose'

// Define the FCL Ports schema
const seaPortsSchema = new mongoose.Schema(
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
    haulage_type: { type: String, required: false },
    ports: [
      {
        port_code: { type: String, required: false },
        port_name: { type: String, required: false },
      },
    ],
  },
  {
    collection: 'seaports', // Specify the collection name
  }
)
export type SeaPortsType = InferSchemaType<typeof seaPortsSchema>
// Export the model, ensuring to use a valid name for the model
export default mongoose.models.seaports ||
  mongoose.model('seaports', seaPortsSchema)
