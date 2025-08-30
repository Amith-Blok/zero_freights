import mongoosedb from '@/lib/mongoose-db'
import { SeaLclConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { ConfirmedQuoteZodSchema } from '@/schema/models/confirmed-quote-zod'

export const createSeaLclConfirmedQuote = async (data: any) => {
  const valid = ConfirmedQuoteZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea fcl data')
  }
  const seaFclData = valid.data
  await mongoosedb()
  const response = await SeaLclConfirmedQuoteModel.create(seaFclData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}
