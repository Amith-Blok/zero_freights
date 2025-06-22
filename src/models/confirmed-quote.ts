import mongoose, { InferSchemaType } from 'mongoose'

const ExchangeSchema = new mongoose.Schema(
  {
    usd_to_inr: { type: Number, required: true },
    inr_to_usd: { type: Number, required: true },
    eur_to_inr: { type: Number, required: true },
    eur_to_usd: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
const ConfimredQuoteData = new mongoose.Schema(
  {
    label: { type: String, required: true },
    inr: { type: Number, required: true },
    usd: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
const LocationSchema = new mongoose.Schema(
  {
    code: { type: String, required: false },
    name: { type: String, require: true },
    type: { type: String, enum: ['door', 'port', 'rail'], required: true },
  },
  {
    _id: false,
  }
)

const UserSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
    user_company: { type: String, required: true },
    user_phone: { type: String, required: true },
  },
  {
    _id: false,
  }
)

const TotalCostSchema = new mongoose.Schema(
  {
    inr: { type: Number, required: true },
    usd: { type: Number, required: true },
  },
  {
    _id: false,
  }
)

const ConfimredQuoteSchema = new mongoose.Schema(
  {
    form_id: { type: String, required: true },
    offer_id: { type: String, required: true },
    offer_date: { type: Date, required: true },
    user: { type: UserSchema, required: true },
    subject: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    bill_to: { type: String, required: true },
    tag: { type: String, required: true },
    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    container_type: { type: String, required: true },
    exchanges: { type: ExchangeSchema, require: true },
    total_cost: { type: TotalCostSchema, required: true },
    carrier: { type: String, required: true },
    transit_time: { type: Number, required: true },
    delivery_type: {
      type: String,
      enum: ['door_to_door', 'door_to_port', 'port_to_door', 'port_to_port'],
      required: true,
    },
    locations: { type: [LocationSchema], required: true },
    confirmed_quote: { type: [ConfimredQuoteData], required: true },
    created_at: { type: Date, required: true },
  },
  {
    versionKey: false,
    collection: 'confirmed_quotes',
  }
)

export type ConfimredQuoteType = InferSchemaType<typeof ConfimredQuoteSchema>
export default mongoose.models.confirmed_quotes ||
  mongoose.model('confirmed_quotes', ConfimredQuoteSchema)
