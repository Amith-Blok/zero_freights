import mongoosedb from '@/lib/mongoose-db'
import { SeaFclOfferModel } from '@/models/offer/offer'
import { OfferZodSchema } from '@/schema/models/offer'

export const createSeaFclOffer = async (data: any) => {
  const valid = OfferZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea fcl data')
  }
  const seaFclData = valid.data
  await mongoosedb()
  const response = await SeaFclOfferModel.create(seaFclData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}
