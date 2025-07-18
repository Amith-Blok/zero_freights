import mongoose, { InferSchemaType } from 'mongoose'
import { ServiceType } from './offer/shared-types'

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

export const ConfimredQuoteData = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['door', 'port', 'rail', 'air', 'warehouse'],
      required: true,
    },
  },
  {
    _id: false,
  }
)

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    phone: { type: String, required: true },
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
    blok_id: { type: String, required: true },
    offer_id: { type: String, required: true },
    offer_date: { type: String, required: true },
    user: { type: UserSchema, required: true },
    subject: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    bill_to: { type: String, required: true },
    service_type: {
      type: String,
      required: true,
      enum: Object.values(ServiceType),
    },
    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    container_type: { type: String, required: true },
    exchanges: { type: ExchangeSchema, require: true },
    total_cost: { type: TotalCostSchema, required: true },
    carrier: { type: String, required: true },
    transit_time: { type: Number, required: true },
    tags: { type: [String], required: true },
    locations: { type: [LocationSchema], required: true },
    data: { type: [ConfimredQuoteData], required: true },
  },
  {
    collection: 'confirmed_quotes',
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
)

export type ConfimredQuoteType = InferSchemaType<typeof ConfimredQuoteSchema>
export type ConfimredQuoteDataType = InferSchemaType<typeof ConfimredQuoteData>
export default mongoose.models.confirmed_quotes ||
  mongoose.model('confirmed_quotes', ConfimredQuoteSchema)
