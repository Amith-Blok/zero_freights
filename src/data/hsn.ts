import mongoosedb from '@/lib/mongoose-db'
import hsn, { HsnType } from '@/models/hsn'

export async function hsnAutoCompleteByQuery(
  query: string
): Promise<HsnType[]> {
  await mongoosedb()
  const response = (await hsn.aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query: query,
          path: {
            wildcard: '*',
          },
        },
      },
    },
    {
      $limit: 5,
    },
  ])) as HsnType[]

  if (!response) {
    throw Error('hsn not found')
  }
  return response
}
