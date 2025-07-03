import mongoosedb from '@/lib/mongoose-db'
import { SeaLclOfferModel } from '@/models/offer/offer-schema'

import { OfferZodSchema } from '@/schema/models/offer'

export const createSeaLclOffer = async (data: any): Promise<string> => {
  //TODO: safepare
  const valid = OfferZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid sea lcl data data')
  }
  const landData = valid.data
  await mongoosedb()
  const response = await SeaLclOfferModel.create(landData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  console.log({ response: response._id })
  return response._id as string
}
