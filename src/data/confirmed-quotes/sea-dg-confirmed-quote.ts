import mongoosedb from '@/lib/mongoose-db'
import { SeaDgConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { SeaDgConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'

export const createSeaDgConfirmedQuote = async (data: any) => {
  const valid = SeaDgConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea dg confirmed quote data')
  }
  const seaDgConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await SeaDgConfirmedQuoteModel.create(
    seaDgConfirmedQuoteData
  )
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
