import mongoose from 'mongoose'
const transform = (ret: any) => {
  ret.id = ret._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
export interface Duties {
  reporter_code: string
  reporter_name: string
  country: string
  year: string
  classification_version: string
  hs_code: string
  value: number
}
interface DutiesDocument extends Duties, Document {}
export const DutiesSchema = new mongoose.Schema<DutiesDocument>(
  {
    reporter_code: { type: String, required: true },
    reporter_name: { type: String, required: true },
    country: { type: String, required: true },
    year: { type: String, required: true },
    classification_version: { type: String, required: true },
    hs_code: { type: String, required: true },
    value: { type: Number, required: true },
  },
  {
    collection: 'duties',
    toJSON: { transform },
  }
)

export const DutiesModel =
  mongoose.models.duties ||
  mongoose.model<DutiesDocument>('duties', DutiesSchema)
