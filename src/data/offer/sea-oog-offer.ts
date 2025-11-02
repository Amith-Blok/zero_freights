import mongoosedb from '@/lib/mongoose-db'
import { SeaOogOfferModel } from '@/models/offer/offer'
import { OfferZodSchema } from '@/schema/models/offer'

export const createSeaOogOffer = async (data: any) => {
  const valid = OfferZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea oog data')
  }
  const seaOogData = valid.data
  await mongoosedb()
  const response = await SeaOogOfferModel.create(seaOogData)
  if (!response) {
    throw Error(' failed to create sea oog offer')
  }
  return response._id
}
