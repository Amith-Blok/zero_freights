// NOTE: This model is outdate please check new version of quote.ts
import { InferSchemaType, Schema, model, models } from 'mongoose'
export const dataSchema = new Schema(
  {
    label: { type: String, required: true },
    code: { type: String, required: true },
    category: { type: String, required: true },
    cost_usd: { type: Number, required: true },
    cost_inr: { type: Number, required: true },
    gst_percentage: { type: Number, required: true },
    gst_amount: { type: Number, required: true },
    total_amount: { type: Number, required: true },
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
    sub_total_inr_cost: { type: Number, required: true },
    gst_five_inr_cost: { type: Number, required: true },
    gst_eighteen_inr_cost: { type: Number, required: true },
    total_usd: { type: Number, required: true },
    quote_date: { type: Date, required: true },
    blok_quote_id: { type: String, required: true },
    line: { type: String, required: true },
    line_quotation_number: { type: String, required: true },
    estimated_day: { type: Number, required: true },
    valid_from: { type: String, required: true },
    valid_to: { type: String, required: true },
    routing: { type: [Object], default: [] },
    data: { type: [dataSchema], required: true },
    form_data: { type: Object, required: true },
  },
  {
    versionKey: false,
    collection: 'quotes',
  }
)

export default models.quotes || model('quotes', quotesSchema)
export type QuoteModelType = InferSchemaType<typeof quotesSchema>
export type DataType = InferSchemaType<typeof dataSchema>
