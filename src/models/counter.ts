import mongoose, { Schema, Document } from 'mongoose'
export enum CounterEnum {
  offer = 'offer',
  quote = 'quote',
}
export interface ICounter extends Document {
  _id: CounterEnum
  seq: number
}

const CounterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true, enum: Object.values(CounterEnum) },
    seq: { type: Number, default: 0 },
  },
  {
    versionKey: false,
  }
)

export default mongoose.models.Counter ||
  mongoose.model<ICounter>('Counter', CounterSchema)
