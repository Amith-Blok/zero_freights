import mongoosedb from '@/lib/mongoose-db'
import hsSix, { HsSixType } from '@/models/hs-six'

export async function hsSixAutoCompleteByQuery(
  query: string
): Promise<HsSixType[]> {
  await mongoosedb()
  const response = (await hsSix.aggregate([
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
      $limit: 8,
    },
  ])) as HsSixType[]
  if (!response) {
    throw Error('hs_six not found')
  }
  return response
}
