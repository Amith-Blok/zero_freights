import mongoosedb from '@/lib/mongoose-db'
import indiaOutboundHaulage, {
  IndiaOutboundHaulageType,
} from '@/models/india-outbound-haulage'

export async function getAllIndiaOutboundHaulageRatesByCode({
  start_code,
  end_code,
}: {
  start_code: string
  end_code: string
}): Promise<IndiaOutboundHaulageType[]> {
  if (!start_code || !end_code) {
    console.log('missing start or end_code')
    throw Error('missing start or end code')
  }
  await mongoosedb()
  const response = await indiaOutboundHaulage
    .find({
      start_code,
      end_code,
      cargo_type: 'DR',
    })
    .lean<IndiaOutboundHaulageType[]>()
  // console.log({ response });
  if (!response) {
    throw Error('no response getLineRatesByCode data fn')
  }
  return response
}
