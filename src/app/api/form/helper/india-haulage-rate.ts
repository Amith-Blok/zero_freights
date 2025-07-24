import { IndiaOutboundHaulageType } from '@/models/india-outbound-haulage'
// import { DContainerType } from '@/types/sea'

// export const filterHaulageRateByWeightContainer = ({
//   haulageRates,
//   ton,
//   dContainer,
// }: {
//   haulageRates: IndiaOutboundHaulageType[]
//   ton: number
//   dContainer: DContainerType
// }): number => {
//   let rate: number
//   let fileredHaulageRate
//   let min_haulage_rate = 0
//   let max_haulage_rate = 0
//   let min_haulage_min = Number.POSITIVE_INFINITY
//   let max_haulage_max = Number.NEGATIVE_INFINITY

//   for (let haulage of haulageRates) {
//     if (
//       haulage.min <= ton &&
//       haulage.max > ton &&
//       haulage.container_type.includes(dContainer)
//     ) {
//       fileredHaulageRate = haulage
//     }
//     if (
//       haulage.container_type.includes(dContainer) &&
//       haulage.min < min_haulage_min
//     ) {
//       min_haulage_min = haulage.min
//       min_haulage_rate = haulage.rate
//     }
//     if (
//       haulage.container_type.includes(dContainer) &&
//       haulage.max > max_haulage_max
//     ) {
//       max_haulage_max = haulage.max
//       max_haulage_rate = haulage.rate
//     }
//   }
//   if (!fileredHaulageRate) {
//     rate = ton < 1 ? min_haulage_rate : max_haulage_rate
//     // console.log({min_haulage_min, min_haulage_rate })
//     // console.log({max_haulage_max, max_haulage_rate })
//     // console.log({ rate })
//     return rate
//   }

//   // console.log({ fileredHaulageRate })
//   if (!fileredHaulageRate) throw Error("Couldn't find rates for rails")

//   rate = fileredHaulageRate.rate
//   return rate
// }

export const filterHaulageRateByWeight = ({
  haulageRates,
  ton,
}: {
  haulageRates: IndiaOutboundHaulageType[]
  ton: number
}): { d2: number; d4: number; d5: number } => {
  const filteredHaulageRate = {
    d2: 0,
    d4: 0,
    d5: 0,
  }
  const BLOK_RAIL_PROFIT = 10000
  const containerTypes: Array<'D2' | 'D4' | 'D5'> = ['D2', 'D4', 'D5']

  for (const containerType of containerTypes) {
    let matched = false
    let minRate = 0
    let maxRate = 0
    let minTon = Number.POSITIVE_INFINITY
    let maxTon = Number.NEGATIVE_INFINITY

    for (const haulage of haulageRates) {
      const haulageTypes = haulage.container_type.split('/') as Array<
        'D2' | 'D4' | 'D5'
      >

      if (haulageTypes.includes(containerType)) {
        if (haulage.min <= ton && ton < haulage.max) {
          filteredHaulageRate[
            containerType.toLowerCase() as 'd2' | 'd4' | 'd5'
          ] = haulage.rate
          matched = true
        }

        if (haulage.min < minTon) {
          minTon = haulage.min
          minRate = haulage.rate
        }
        if (haulage.max > maxTon) {
          maxTon = haulage.max
          maxRate = haulage.rate
        }
      }
    }

    if (!matched) {
      filteredHaulageRate[containerType.toLowerCase() as 'd2' | 'd4' | 'd5'] =
        ton < 1 ? minRate : maxRate
    }
  }

  if (
    !filteredHaulageRate.d2 &&
    !filteredHaulageRate.d4 &&
    !filteredHaulageRate.d5
  ) {
    throw new Error("Couldn't find rates for rails")
  }
  filteredHaulageRate.d2 = filteredHaulageRate.d2 + BLOK_RAIL_PROFIT
  filteredHaulageRate.d4 = filteredHaulageRate.d4 + BLOK_RAIL_PROFIT
  filteredHaulageRate.d5 = filteredHaulageRate.d5 + BLOK_RAIL_PROFIT

  return filteredHaulageRate
}
