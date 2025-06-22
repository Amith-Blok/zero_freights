import mongoosedb from '@/lib/mongoose-db'
import quote, { QuoteModelType } from '@/models/new_quote'
import { QuoteType } from '@/types/quotes'

export async function createQuote(data: QuoteType): Promise<string> {
  if (!data) {
    console.log('missing data')
    throw Error('missing data')
  }
  // console.log({ data });
  await mongoosedb()
  const response = await quote.create(data)
  if (!response._id) {
    throw Error('couldnt create quote')
  }
  return response._id
}
export async function getQuoteById(id: string): Promise<QuoteModelType> {
  if (!id) {
    console.log('missing data')
    throw Error('missing data')
  }
  await mongoosedb()
  const response = await quote
    .findById(
      { _id: id },
      {
        user_id: 1,
        blok_quote_id: 1,
        user_name: 1,
        user_company: 1,
        bill_to: 1,
        place_of_supply: 1,
        subject: 1,
        total_inr: 1,
        gst_five_inr_cost: 1,
        gst_eighteen_inr_cost: 1,
        sub_total_inr_cost: 1,
        total_usd: 1,
        valid_from: 1,
        valid_to: 1,
        data: 1,
      }
    )
    .lean<QuoteModelType>()
  if (!response) {
    throw Error('couldnt get quote by id')
  }
  return response
}
