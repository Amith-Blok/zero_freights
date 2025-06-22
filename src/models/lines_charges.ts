import mongoose from 'mongoose'
const SectionDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  currency: { type: String, required: true },
  is_considered_for_total: { type: String, required: false },
  additional_notes: { type: String, required: false },
  d2: { type: Number, required: true },
  d4: { type: Number, required: true },
  d5: { type: Number, required: true },
})

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  data: { type: [SectionDataSchema], required: true },
})
const Routing = new mongoose.Schema({
  location_name: { type: String, required: true },
  locode: { type: String, required: true },
  country_code: { type: String, required: true },
  mode_of_transport: { type: String, required: false },
  point_usage: { type: String, required: false },
  is_sea_port: { type: Boolean, required: false },
})
const LineSchema = new mongoose.Schema({
  line_name: { type: String, required: true },
  quotation_number: { type: String, required: true },
  estimated_days: { type: Number, required: true },
  valid_to: { type: String, required: true },
  routing: { type: [Routing], required: true },
  sections: { type: [SectionSchema], required: true },
})

const LinesChargeSchema = new mongoose.Schema(
  {
    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    available_lines: { type: [String], required: true },
    lines: { type: [LineSchema], required: true },
  },
  {
    collection: 'lines_charges',
  }
)

// Create the model
const LinesCharges =
  mongoose.models.lines_charges ||
  mongoose.model('lines_charges', LinesChargeSchema)

export type LinesChargesType = mongoose.InferSchemaType<
  typeof LinesChargeSchema
>

export default LinesCharges
