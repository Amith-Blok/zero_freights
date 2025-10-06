import mongoosedb from '@/lib/mongoose-db'
import airFreight, { AirFreightType } from '@/models/air-freight'

export const airFreightByStartEndCode = async ({
  startCode,
  endCode,
}: {
  startCode: string
  endCode: string
}) => {
  if (!startCode && !endCode) {
    throw new Error('invalid air freight code')
  }
  await mongoosedb()
  console.log({ startCode, endCode })
  const response = await airFreight
    .findOne({ start_code: startCode, end_code: endCode })
    .lean<AirFreightType>()

  console.log({ response })
  if (!response) {
    throw new Error('no air freight result')
  }
  return response
}
