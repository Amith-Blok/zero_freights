import { transform } from '@/lib/mongoose-transform'
import mongoose, { Document, Model } from 'mongoose'

// Define the TypeScript interface for the document
export interface ITerminalHandlingCharge extends Document {
  port_name: string
  port_code: string
  currency: string
  d2: number
  d4: number
  d5: number
  h2: number
  h4: number
  s2: number
  s4: number
  r2: number
  r4: number
  created_at: Date
  update_at: Date
}

const TerminalHandlingChargeSchema =
  new mongoose.Schema<ITerminalHandlingCharge>(
    {
      port_name: { type: String, required: true },
      port_code: { type: String, required: true },
      currency: { type: String, required: true },
      d2: { type: Number, required: true },
      d4: { type: Number, required: true },
      d5: { type: Number, required: true },
      h2: { type: Number, required: true },
      h4: { type: Number, required: true },
      s2: { type: Number, required: true },
      s4: { type: Number, required: true },
      r2: { type: Number, required: true },
      r4: { type: Number, required: true },
    },
    {
      _id: true,
      collection: 'terminal_handling_charges',
      timestamps: { updatedAt: 'update_at', createdAt: 'created_at' },
      toJSON: { transform: transform },
    }
  )

const TerminalHandlingCharge =
  (mongoose.models
    .terminal_handling_charges as Model<ITerminalHandlingCharge>) ||
  mongoose.model<ITerminalHandlingCharge>(
    'terminal_handling_charges',
    TerminalHandlingChargeSchema
  )

export default TerminalHandlingCharge
