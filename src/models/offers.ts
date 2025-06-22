import mongoose, { InferSchemaType } from 'mongoose'

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
const ContainerCostSchema = new mongoose.Schema(
  {
    d2: { type: Number, required: true },
    d4: { type: Number, required: true },
    d5: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
const RateByContainerSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    currency: { type: String, required: true },
    additional_notes: { default: '', type: String },
    d2: { type: Number, required: true },
    d4: { type: Number, required: true },
    d5: { type: Number, required: true },
  },
  {
    _id: false,
  }
)

const MultiCurrencyCostSchema = new mongoose.Schema(
  {
    inr: { type: ContainerCostSchema, required: true },
    usd: { type: ContainerCostSchema, requrired: true },
  },
  {
    _id: false,
  }
)
const SeaFreightSchema = new mongoose.Schema(
  {
    line_name: { type: String, require: true },
    port_to_days: { type: Number, require: true },
    estimated_days: { type: Number, require: true },
    total_cost: { type: MultiCurrencyCostSchema, require: true },
    valid_to: { tye: String },
    data: { type: [RateByContainerSchema], required: true },
  },
  {
    _id: false,
  }
)

const OfferDataSchema = new mongoose.Schema(
  {
    sea_freights: { type: [SeaFreightSchema], required: true },
    local_charges: { type: [RateByContainerSchema], required: true },
  },
  {
    _id: false,
  }
)

const OfferSchema = new mongoose.Schema(
  {
    form_id: { type: String, required: true },
    offer_id: { type: String, required: true },
    user_id: { type: String, required: true },
    user_email: { type: String, required: true },
    user_name: { type: String, required: true },
    user_company: { type: String, required: true },
    user_phone: { type: String, required: false },
    subject: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    bill_to: { type: String, required: true },
    tag: { type: String, required: true },
    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    container_type: { type: String, required: true },
    exchanges: { type: ExchangeSchema, require: true },
    delivery_type: {
      type: String,
      enum: ['door_to_door', 'door_to_port', 'port_to_door', 'port_to_port'],
      required: true,
    },
    locations: { type: [LocationSchema], required: true },
    offers: { type: OfferDataSchema, required: true },
    created_at: { type: Date, required: true },
  },
  {
    versionKey: false,
    collection: 'offers',
  }
)

export type OfferType = InferSchemaType<typeof OfferSchema>
export type SeaFreightType = InferSchemaType<typeof SeaFreightSchema>
export type RateByContainerType = InferSchemaType<typeof RateByContainerSchema>
export type LocationType = InferSchemaType<typeof LocationSchema>
export default mongoose.models.offers || mongoose.model('offers', OfferSchema)
