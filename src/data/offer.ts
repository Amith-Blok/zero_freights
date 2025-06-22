import mongoosedb from '@/lib/mongoose-db'
import { OfferType } from '@/models/offers'
import offer from '@/models/offers'

export const createOffer = async (data: OfferType) => {
  if (!data) {
    console.log('no data found, failed to create offer')
    throw Error('no data found, failed to create offer')
  }
  await mongoosedb()
  const response = await offer.create(data)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}

export const getOfferById = async (offerId: string): Promise<OfferType> => {
  await mongoosedb()
  const response = await offer.findById({ _id: offerId }).lean<OfferType>()
  if (!response) {
    throw Error('Couldnt find offer')
  }
  return response
}
