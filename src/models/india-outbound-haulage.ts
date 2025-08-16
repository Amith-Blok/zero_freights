import mongoose from 'mongoose'

const IndiaOutboundHaulageSchema = new mongoose.Schema(
  {
    start_code: {
      type: String,
      required: true,
    },
    start_name: {
      type: String,
      required: true,
    },
    end_port: {
      type: String,
      required: true,
    },
    end_name: {
      type: String,
      required: true,
    },
    container_type: {
      type: String,
      required: true,
    },
    container_name: {
      type: String,
      required: true,
    },
    cargo_type: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    effective_date: {
      type: Date,
      required: true,
    },
    //min and max are in ton
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    transportation_mode: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'india_outbound_haulage',
  }
)
export type IndiaOutboundHaulageType = mongoose.InferSchemaType<
  typeof IndiaOutboundHaulageSchema
>
export default mongoose.models.india_outbound_haulage ||
  mongoose.model('india_outbound_haulage', IndiaOutboundHaulageSchema)
