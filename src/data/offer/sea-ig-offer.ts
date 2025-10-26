import mongoosedb from '@/lib/mongoose-db'
import { SeaIgOfferModel } from '@/models/offer/offer'
import { OfferZodSchema } from '@/schema/models/offer'

export const createSeaIgOffer = async (data: any) => {
  const valid = OfferZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea fcl data')
  }
  const seaIgData = valid.data
  await mongoosedb()
  const response = await SeaIgOfferModel.create(seaIgData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}
