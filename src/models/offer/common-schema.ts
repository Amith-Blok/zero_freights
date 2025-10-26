import mongoose, { Document } from 'mongoose'
import { Exchange, LabeledCost, TotalCost } from './shared-types'
export const TotalCostByContainerTypeSchema = new mongoose.Schema(
  {
    d2: { type: Number, required: true },
    d4: { type: Number, required: true },
    d5: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    _id: false,
  }
)

export const IgTotalCostByContainerTypeSchema = new mongoose.Schema({
  ot2: { type: Number, required: true },
  ot4: { type: Number, required: true },
  fr2: { type: Number, required: true },
  fr4: { type: Number, required: true },
  fr5: { type: Number, required: true },
  total: { type: Number, required: true },
})
export const ContainerCostSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    currency: { type: String, required: true },
    additional_notes: { default: '', type: String },
    d2: { type: Number, required: true },
    d4: { type: Number, required: true },
    d5: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
export const IgContainerCostSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    currency: { type: String, required: true },
    additional_notes: { default: '', type: String },
    ot2: { type: Number, required: true },
    ot4: { type: Number, required: true },
    fr2: { type: Number, required: true },
    fr4: { type: Number, required: true },
    fr5: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
export const MultiCurrencyContainerCostSchema = new mongoose.Schema(
  {
    total_cost: {
      inr: { type: TotalCostByContainerTypeSchema, required: true },
      usd: { type: TotalCostByContainerTypeSchema, required: true },
    },
    freight_cost: {
      inr: { type: TotalCostByContainerTypeSchema, required: true },
      usd: { type: TotalCostByContainerTypeSchema, required: true },
    },
    local_cost: {
      inr: { type: TotalCostByContainerTypeSchema, required: true },
      usd: { type: TotalCostByContainerTypeSchema, required: true },
    },
  },
  {
    _id: false,
  }
)

export const IgMultiCurrencyContainerCostSchema = new mongoose.Schema(
  {
    total_cost: {
      inr: { type: IgTotalCostByContainerTypeSchema, required: true },
      usd: { type: IgTotalCostByContainerTypeSchema, required: true },
    },
    freight_cost: {
      inr: { type: IgTotalCostByContainerTypeSchema, required: true },
      usd: { type: IgTotalCostByContainerTypeSchema, required: true },
    },
    local_cost: {
      inr: { type: IgTotalCostByContainerTypeSchema, required: true },
      usd: { type: IgTotalCostByContainerTypeSchema, required: true },
    },
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
  cost_breakdown: { type: MultiCurrencyContainerCostSchema, required: true },
  valid_to: { type: String, required: true },
  data: { type: ContainerCostSchema, required: true },
})

export const IgLineChargeSchema = new mongoose.Schema({
  line_name: { type: String, required: true },
  port_to_days: { type: Number, required: true },
  estimated_days: { type: Number, required: true },
  tags: { type: [String], required: true },
  cost_breakdown: { type: IgMultiCurrencyContainerCostSchema, required: true },
  valid_to: { type: String, required: true },
  data: { type: IgContainerCostSchema, required: true },
})
export const SeaFclOfferSchema = new mongoose.Schema({
  line_charges: { type: [LineChargeSchema], required: true },
  local_charges: { type: [ContainerCostSchema], required: true },
})

export const SeaIgOfferSchema = new mongoose.Schema({
  line_charges: { type: [IgLineChargeSchema], required: true },
  local_charges: { type: [IgContainerCostSchema], required: true },
})

export function getOrCreateDiscriminator<T extends Document>(
  model: mongoose.Model<any>,
  name: string,
  schema: mongoose.Schema<T>
): mongoose.Model<T> {
  // Check if the discriminator already exists
  if (model.discriminators && model.discriminators[name]) {
    return model.discriminators[name] as mongoose.Model<T>
  }

  // Check if a model with this name already exists in mongoose.models
  const modelName = `${model.modelName}__${name}`
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as mongoose.Model<T>
  }

  try {
    return model.discriminator<T>(name, schema)
  } catch (error) {
    // If discriminator creation fails due to overwrite error, return existing model
    if (error instanceof Error && error.message.includes('Cannot overwrite')) {
      if (model.discriminators && model.discriminators[name]) {
        return model.discriminators[name] as mongoose.Model<T>
      }
      // As last resort, try to find the model in mongoose.models
      const existingModel = Object.values(mongoose.models).find(
        (m) => m.modelName === name || m.modelName.includes(name)
      ) as mongoose.Model<T>
      if (existingModel) {
        return existingModel
      }
    }
    throw error
  }
}
