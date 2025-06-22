import mongoose from 'mongoose'

export const WarehouseSchema = new mongoose.Schema(
  {
    port_name: {
      type: String,
      require: true,
    },
    port_code: {
      type: String,
      require: true,
    },
    place_id: {
      type: String,
      require: true,
    },
    port_country: {
      type: String,
      require: true,
    },
    cost: {
      type: Number,
      require: true,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: {
        type: [Number],
        require: true,
      },
    },
  },
  {
    collection: 'warehouses',
  }
)
export type WarehousesType = mongoose.InferSchemaType<typeof WarehouseSchema>
export default mongoose.models.warehouses ||
  mongoose.model('warehouses', WarehouseSchema)
