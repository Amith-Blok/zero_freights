import mongoose, { InferSchemaType } from 'mongoose'

const hsnSchema = new mongoose.Schema(
  {
    hsn_code: {
      type: String,
      required: true,
    },
    hsn_des: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'hsn',
  }
)
export type HsnType = InferSchemaType<typeof hsnSchema>
export default mongoose.models.hsn || mongoose.model('hsn', hsnSchema)
