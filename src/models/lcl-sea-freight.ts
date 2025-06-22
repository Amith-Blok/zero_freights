import { COUNTRIES } from '@/constants'
import mongoose from 'mongoose'

const LCLSeaFreightSchema = new mongoose.Schema(
  {
    port_code: {
      type: String,
      required: true,
    },
    port_name: {
      type: String,
      required: true,
    },
    port_country: {
      type: String,
      required: true,
      enum: COUNTRIES,
    },
    lcl_cost: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'lcl_sea_freight',
  }
)

export type LCLSeaFreightType = mongoose.InferSchemaType<
  typeof LCLSeaFreightSchema
>

export default mongoose.models.lcl_sea_freight ||
  mongoose.model('lcl_sea_freight', LCLSeaFreightSchema)
