import mongoosedb from '@/lib/mongoose-db'
import { SeaIgConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { SeaIgConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'

export const createSeaIgConfirmedQuote = async (data: any) => {
  const valid = SeaIgConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea rf confirmed quote data')
  }
  const seaIgConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await SeaIgConfirmedQuoteModel.create(
    seaIgConfirmedQuoteData
  )
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
