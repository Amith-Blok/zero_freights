import mongoosedb from '@/lib/mongoose-db'
import { WarehouseOfferModel } from '@/models/offer/offer-schema'

import { OfferZodSchema } from '@/schema/models/offer'

export const createWarehouseOffer = async (data: any) => {
  //TODO: safepare
  const valid = OfferZodSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid warehouse data data')
  }
  const warehouseData = valid.data
  await mongoosedb()
  const response = await WarehouseOfferModel.create(warehouseData)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}
