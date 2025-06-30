import mongoose, { Document } from 'mongoose'
import { Exchange, LabeledCost, TotalCost } from './shared-types'
export const ContainerCostBreakdownSchema = new mongoose.Schema(
  {
    d2: { type: Number, required: true },
    d4: { type: Number, required: true },
    d5: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
export const ContainerCostSchema = new mongoose.Schema(
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

export const MultiCurrencyContainerCostSchema = new mongoose.Schema(
  {
    inr: { type: ContainerCostBreakdownSchema, required: true },
    usd: { type: ContainerCostBreakdownSchema, requrired: true },
  },
  {
    _id: false,
  }
)
export const ExchangeSchema = new mongoose.Schema<Exchange>(
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

export const LabeledCostSchema = new mongoose.Schema<LabeledCost>(
  {
    label: { type: String, required: true },
    inr: { type: Number, required: true },
    usd: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
export const TotalCostSchema = new mongoose.Schema<TotalCost>({
  inr: { type: Number, required: true },
  usd: { type: Number, required: true },
})

export const LineChargeSchema = new mongoose.Schema({
  line_name: { type: String, required: true },
  port_to_days: { type: Number, required: true },
  estimated_days: { type: Number, required: true },
  total_cost: { type: MultiCurrencyContainerCostSchema, required: true },
  valid_to: { type: String, required: true },
  data: { type: ContainerCostSchema, required: true },
})
export const SeaFclOfferSchema = new mongoose.Schema({
  line_charges: { type: [LineChargeSchema], required: true },
  local_charges: { type: [ContainerCostSchema], required: true },
})
export function getOrCreateDiscriminator<T extends Document>(
  model: mongoose.Model<any>,
  name: string,
  schema: mongoose.Schema<T>
): mongoose.Model<T> {
  if (model.discriminators && model.discriminators[name]) {
    return model.discriminators[name] as mongoose.Model<T>
  }
  return model.discriminator<T>(name, schema)
}
