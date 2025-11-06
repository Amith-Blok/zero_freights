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
