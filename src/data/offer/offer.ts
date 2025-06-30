import mongoosedb from '@/lib/mongoose-db'
import { OfferModel } from '@/models/offer/offer-schema'
import { OfferZodSchema } from '@/schema/models/offer'
import { z } from 'zod'

export const getOfferById = async (
  id: string
): Promise<z.infer<typeof OfferZodSchema>> => {
  await mongoosedb()
  const response = await OfferModel.findById(id).lean()
  if (!response) {
    throw 'Failed offerbyid'
  }
  const vaildData = OfferZodSchema.safeParse(response)
  if (!vaildData.success) {
    console.log({ error: JSON.stringify(vaildData.error) })
    throw 'invalid get offer data'
  }
  return vaildData.data
}
