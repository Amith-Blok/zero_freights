import mongoosedb from '@/lib/mongoose-db'
import LinesRates, { LinesRatesType } from '@/models/lines-rates'

export async function getLinesRatesByCode({
  start_code,
  end_code,
}: {
  start_code: string
  end_code: string
}): Promise<LinesRatesType> {
  // console.log({ start_code, end_code });
  if (!start_code || !end_code) {
    console.log('missing start or end_code')
    throw Error('missing start or end code')
  }
  await mongoosedb()
  const response = await LinesRates.findOne({
    start_code,
    end_code,
  }).lean<LinesRatesType>()
  if (!response) {
    throw Error(
      `no response getLineRatesByCode for ${start_code} -> ${end_code}`
    )
  }
  return response
}
