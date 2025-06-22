import mongoosedb from '@/lib/mongoose-db'
import LinesCharges, { LinesChargesType } from '@/models/lines_charges'

export async function getLinesChargesByCode({
  start_code,
  end_code,
}: {
  start_code: string
  end_code: string
}): Promise<LinesChargesType> {
  // console.log({ start_code, end_code });
  if (!start_code || !end_code) {
    console.log('missing start or end_code')
    throw Error('missing start or end code')
  }
  await mongoosedb()
  const response = await LinesCharges.findOne({
    start_code,
    end_code,
  }).lean<LinesChargesType>()
  if (!response) {
    throw Error(
      `no response getLineRatesByCode for ${start_code} -> ${end_code}`
    )
  }
  return response
}
