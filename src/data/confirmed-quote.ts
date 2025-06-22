import mongoosedb from '@/lib/mongoose-db'
import confirmedQuote, { ConfimredQuoteType } from '@/models/confirmed-quote'
import { ConfirmedQuoteZodType } from '@/schema/models/confirmed-quote-zod'

export const createConfirmedQuote = async (data: ConfirmedQuoteZodType) => {
  if (!data) {
    console.log('no data found, failed to create offer')
    throw Error('no data found, failed to create offer')
  }
  await mongoosedb()
  const response = await confirmedQuote.create(data)
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response._id
}

export const getConfirmedQuoteById = async (
  offerId: string
): Promise<ConfimredQuoteType> => {
  await mongoosedb()
  const response = await confirmedQuote
    .findById({ _id: offerId })
    .lean<ConfimredQuoteType>()
  if (!response) {
    throw Error('Couldnt find offer')
  }
  return response
}
