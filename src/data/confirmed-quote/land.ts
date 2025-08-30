import mongoosedb from '@/lib/mongoose-db'
import { LandConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { ConfirmedQuoteZodSchema } from '@/schema/models/confirmed-quote-zod'

export const createLandConfirmedQuote = async (data: any) => {
  const valid = ConfirmedQuoteZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea fcl data')
  }
  const landData = valid.data
  await mongoosedb()
  const response = await LandConfirmedQuoteModel.create(landData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}
