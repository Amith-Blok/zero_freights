import mongoosedb from '@/lib/mongoose-db'
import { SeaRfOfferModel } from '@/models/offer/offer'
import { OfferZodSchema } from '@/schema/models/offer'

export const createSeaRfOffer = async (data: any) => {
  const valid = OfferZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea rf data')
  }
  const seaRfData = valid.data
  await mongoosedb()
  const response = await SeaRfOfferModel.create(seaRfData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}
