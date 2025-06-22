import mongoose from 'mongoose'

const FormSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true },
    created_at: { type: Date, required: true },
  },
  { collection: 'forms' }
)

export type FormType = mongoose.SchemaType<typeof FormSchema>
export default mongoose.models.forms || mongoose.model('forms', FormSchema)
