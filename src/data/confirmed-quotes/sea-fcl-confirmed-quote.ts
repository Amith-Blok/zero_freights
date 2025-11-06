import mongoosedb from '@/lib/mongoose-db'
import { SeaFclConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { SeaFclConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'

export const createSeaFclConfirmedQuote = async (data: any) => {
  const valid = SeaFclConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea fcl confirmed quote data')
  }
  const seaFclConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await SeaFclConfirmedQuoteModel.create(
    seaFclConfirmedQuoteData
  )
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
