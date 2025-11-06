import mongoosedb from '@/lib/mongoose-db'
import { SeaRfConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { SeaRfConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'

export const createSeaRfConfirmedQuote = async (data: any) => {
  const valid = SeaRfConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea rf confirmed quote data')
  }
  const seaRfConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await SeaRfConfirmedQuoteModel.create(
    seaRfConfirmedQuoteData
  )
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
