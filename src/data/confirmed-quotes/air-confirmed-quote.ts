import mongoosedb from '@/lib/mongoose-db'
import { AirConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { AirConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'
export const createAirConfirmedQuote = async (data: any) => {
  const valid = AirConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid warehouse confirmed quote data')
  }
  const airConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await AirConfirmedQuoteModel.create(airConfirmedQuoteData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
