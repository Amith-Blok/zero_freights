import UsLtlAirport, { UsLtlAirportType } from '@/models/us-ltl-airport'

export async function getUsLtlAirportByStartEndCode({
  startCode,
  endCode,
}: {
  startCode: string
  endCode: string
}) {
  if (!startCode || !endCode) {
    throw new Error(
      'missing startCode or endCode getUsLtlAirportByStartEndCode'
    )
  }
  const response = UsLtlAirport.findOne({
    start_code: startCode,
    end_code: endCode,
  }).lean<UsLtlAirportType>()
  if (!response) {
    throw new Error('not data Found')
  }
  return response
}
