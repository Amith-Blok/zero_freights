import mongoose from 'mongoose'

export const ExchangeSchema = new mongoose.Schema(
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

export const ConfirmedQuoteData = new mongoose.Schema(
  {
    label: { type: String, required: true },
    inr: { type: Number, required: true },
    usd: { type: Number, required: true },
  },
  {
    _id: false,
  }
)

export const LocationSchema = new mongoose.Schema(
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

export const TotalCostSchema = new mongoose.Schema(
  {
    inr: { type: Number, required: true },
    usd: { type: Number, required: true },
  },
  {
    _id: false,
  }
)
