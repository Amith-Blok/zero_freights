import mongoose, { Document, Model } from 'mongoose'
const transform = (ret: any) => {
  ret.id = ret._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}

interface Form {
  data: Object
  create_at: string
}
type FormDocument = Form & Document
const FormSchema = new mongoose.Schema<FormDocument>(
  {
    data: { type: Object, required: true },
  },
  {
    _id: true,
    collection: 'forms',
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { transform },
  }
)

export type FormType = mongoose.SchemaType<typeof FormSchema>
export default (mongoose.models.forms as Model<FormDocument>) ||
  mongoose.model<FormDocument>('forms', FormSchema)
