import mongoosedb from '@/lib/mongoose-db'
import { ConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import {
  ConfirmedQuote,
  ConfirmedQuoteSchema,
} from '@/schema/models/confirmed-quote-new-zod'

export const getConfirmedQuoteById = async (
  id: string
): Promise<ConfirmedQuote> => {
  await mongoosedb()
  const response = await ConfirmedQuoteModel.findById(id).lean()
  if (!response) {
    throw 'Failed confirmed quote by id'
  }
  const vaildData = ConfirmedQuoteSchema.safeParse(response)
  if (!vaildData.success) {
    console.log({ error: JSON.stringify(vaildData.error) })
    throw 'invalid get confirmed quote data'
  }
  return vaildData.data
}

export const getConfirmedQuoteByBlokIdAndUserId = async (params: {
  offerId: string
  userId: string
}): Promise<string | null> => {
  const { offerId, userId } = params
  console.log({ offerId, userId })
  await mongoosedb()
  const response = await ConfirmedQuoteModel.findOne({
    offer_id: offerId,
    user_id: userId,
  })
    .select({ _id: 1 })
    .lean()
  if (!response) {
    console.log(response)
    throw Error('Failed to get confirmed quote by blok id and user id')
  }
  return response._id.toString()
}

export const getPaginatedConfirmedQuotes = async (params: {
  userId: string
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}) => {
  const { userId, page, limit, sortBy, sortOrder } = params
  const skip = (page - 1) * limit
  await mongoosedb()
  const [confirmedQuotes, total] = await Promise.all([
    ConfirmedQuoteModel.find({ user_id: userId })
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
    ConfirmedQuoteModel.countDocuments({ user_id: userId }),
  ])
  if (!confirmedQuotes || !total) {
    throw 'Failed to get paginated confirmed quotes'
  }
  return {
    data: confirmedQuotes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
