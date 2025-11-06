import mongoosedb from '@/lib/mongoose-db'
import { LandConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { LandConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'

export const createLandConfirmedQuote = async (data: any) => {
  const valid = LandConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid land confirmed quote data')
  }
  const landConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await LandConfirmedQuoteModel.create(landConfirmedQuoteData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
