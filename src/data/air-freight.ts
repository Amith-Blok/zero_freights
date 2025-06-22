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
  const response = await airFreight
    .findOne({ start_code: startCode, end_code: endCode })
    .lean<AirFreightType>()
  if (!response) {
    throw new Error('no air freight result')
  }
  return response
}
