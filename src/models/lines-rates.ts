import mongoose from 'mongoose'

//NOTE: This model is outdated plesae use blok-lines-rates model.
const ChargeDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  currency: { type: String, required: true },
  container1: { type: Number, required: true },
  container2: { type: Number, required: true },
  container3: { type: Number, required: true },
})

const ChargeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., SEA_FREIGHT
  label: { type: String, required: true }, // e.g., Freight Charges
  data: { type: [ChargeDataSchema], required: true },
})

const RateSchema = new mongoose.Schema({
  line_name: { type: String, required: true }, // e.g., "hapag", "oneline"
  quotation_number: { type: String, required: true },
  estimated_days: { type: Number, required: true },
  valid_from: { type: String, required: true },
  valid_to: { type: String, required: true },
  commodity_description: { type: String, required: true },
  routing: { type: [Object], required: true }, // Assuming routes have their own structure; you can define a separate schema if needed.
  charges: { type: [ChargeCategorySchema], required: true },
})

const LinesRatesSchema = new mongoose.Schema(
  {
    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    available_lines: { type: [String], required: true }, // e.g., ["hapag", "oneline"]
    rates: { type: [RateSchema], required: true },
  },
  {
    collection: 'lines_rates',
  }
)

// Create the model
const LinesRates =
  mongoose.models.lines_rates || mongoose.model('lines_rates', LinesRatesSchema)

export type LinesRatesType = mongoose.InferSchemaType<typeof LinesRatesSchema>

export default LinesRates
