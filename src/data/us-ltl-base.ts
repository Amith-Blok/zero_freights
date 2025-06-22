import UsLtlBase, { UsLtlBaseType } from '@/models/us-ltl-base'

export async function getUsLtlBaseByFaZone({
  faStation,
  zone,
}: {
  faStation: string
  zone: string
}) {
  if (!faStation || !zone) {
    throw new Error('missing fa_station or zone getUsLtlBaseByFaZone')
  }
  const response = UsLtlBase.findOne({
    fa_station: faStation,
    zone,
  }).lean<UsLtlBaseType>()
  if (!response) {
    throw new Error('not data Found')
  }
  return response
}
