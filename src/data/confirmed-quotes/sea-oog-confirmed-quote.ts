import mongoosedb from '@/lib/mongoose-db'
import { SeaOogConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { SeaOogConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'

export const createSeaOogConfirmedQuote = async (data: any) => {
  const valid = SeaOogConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea oog confirmed quote data')
  }
  const seaOogConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await SeaOogConfirmedQuoteModel.create(
    seaOogConfirmedQuoteData
  )
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
