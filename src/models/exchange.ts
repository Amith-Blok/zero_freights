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
