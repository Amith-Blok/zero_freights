import mongoosedb from '@/lib/mongoose-db'
import { OfferModel } from '@/models/offer/offer'
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
export const getOfferByBlokIdAndUserId = async (params: {
  blokId: string
  userId: string
}): Promise<string> => {
  const { blokId, userId } = params
  await mongoosedb()
  const response = await OfferModel.findOne({
    blok_id: blokId,
    user_id: userId,
  }).lean()
  if (!response) {
    throw Error('Failed to get offer by blok id and user id')
  }
  return response.blok_id
}
export const getPaginatedOffers = async (params: {
  userId: string
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}) => {
  const { userId, page, limit, sortBy, sortOrder } = params
  const skip = (page - 1) * limit
  await mongoosedb()
  const [offers, total] = await Promise.all([
    OfferModel.find({ user_id: userId })
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .select({
        _id: 1,
        blok_id: 1,
        service_type: 1,
        locations: 1,
        tags: 1,
        created_at: 1,
      })
      .lean(),
    OfferModel.countDocuments({ user_id: userId }),
  ])
  if (!offers || !total) {
    throw 'Failed to get paginated offers'
  }
  return {
    data: offers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
