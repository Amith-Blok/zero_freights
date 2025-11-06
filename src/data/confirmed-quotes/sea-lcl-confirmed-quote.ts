import mongoosedb from '@/lib/mongoose-db'
import { SeaLclConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { SeaLclConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'

export const createSeaLclConfirmedQuote = async (data: any) => {
  const valid = SeaLclConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea lcl confirmed quote data')
  }
  const seaLclConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await SeaLclConfirmedQuoteModel.create(
    seaLclConfirmedQuoteData
  )
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
