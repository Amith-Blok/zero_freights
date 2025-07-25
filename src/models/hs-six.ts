import mongoose, { InferSchemaType } from 'mongoose'

const hsSixSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    chapter: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    subheading: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'hs_six',
  }
)
export type HsSixType = InferSchemaType<typeof hsSixSchema>
export default mongoose.models.hs_six || mongoose.model('hs_six', hsSixSchema)
