import mongoosedb from '@/lib/mongoose-db'
import { WarehouseConfirmedQuoteModel } from '@/models/confirmed-quote/confirmed-quote'
import { WarehouseConfirmedQuoteSchema } from '@/schema/models/confirmed-quote-new-zod'
export const createWarehouseConfirmedQuote = async (data: any) => {
  const valid = WarehouseConfirmedQuoteSchema.safeParse(data)
  if (!valid.success) {
    valid.error.errors.forEach((err) => {
      console.error(`❌ [${err.path.join('.')}] ${err.message}`)
    })
    throw Error('Invalid warehouse confirmed quote data')
  }
  const warehouseConfirmedQuoteData = valid.data
  await mongoosedb()
  const response = await WarehouseConfirmedQuoteModel.create(
    warehouseConfirmedQuoteData
  )
  if (!response) {
    throw Error(' failed to create offer')
  }
  return response.id
}
