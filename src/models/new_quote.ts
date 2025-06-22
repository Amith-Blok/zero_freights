import { InferSchemaType, Schema, model, models } from 'mongoose'
export const dataSchema = new Schema(
  {
    label: { type: String, required: true },
    code: { type: String, required: true },
    category: { type: String, required: true },
    usd: { type: Number, required: true },
    inr: { type: Number, required: true },
  },
  { _id: false }
)

const quotesSchema = new Schema(
  {
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    user_company: { type: String, required: true },
    subject: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    bill_to: { type: String, required: true },
    total_inr: { type: Number, required: true },
    total_usd: { type: Number, required: true },
    quote_date: { type: Date, required: true },
    offer_id: { type: String, required: true },
    line: { type: String, required: true },
    estimated_day: { type: Number, required: true },
    valid_to: { type: String, required: true },
    routing: { type: [Object], default: [] },
    data: { type: [dataSchema], required: true },
  },
  {
    versionKey: false,
    collection: 'new_quote',
  }
)

export default models.new_quotes || model('new_quotes', quotesSchema)
export type QuoteModelType = InferSchemaType<typeof quotesSchema>
export type DataType = InferSchemaType<typeof dataSchema>
