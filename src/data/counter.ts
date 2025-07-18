import mongoosedb from '@/lib/mongoose-db'
import CounterModel, { CounterEnum, ICounter } from '../models/counter'

export async function getNextSequence(
  sequenceName: CounterEnum
): Promise<string> {
  await mongoosedb()
  const updated = await CounterModel.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean<ICounter>()
  if (!updated) {
    throw new Error('Failed to get next sequence')
  }
  return updated.seq.toString()
}
