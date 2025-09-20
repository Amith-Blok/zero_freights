import { IndiaOutboundHaulageType } from '@/models/india-outbound-haulage'
import {
  FclQuantitiesType,
  FclWeightsType,
  FclWeightUnitType,
} from '@/schema/sea-schema'
import { weightTOMetricTon } from '@/lib/utils'

export const filterHaulageRateByWeight = ({
  haulageRates,
  fcl_weights,
  fcl_unit,
  fcl_quantities,
}: {
  haulageRates: IndiaOutboundHaulageType[]
  fcl_weights: FclWeightsType
  fcl_unit: FclWeightUnitType
  fcl_quantities: FclQuantitiesType
}): { d2: number; d4: number; d5: number; total: number } => {
  const filteredHaulageRate = { d2: 0, d4: 0, d5: 0, total: 0 }
  const BLOK_RAIL_PROFIT = 10000

  // Container type mapping from FCL schema to haulage schema
  const containerMapping = {
    '20STD': 'D2',
    '40STD': 'D4',
    '40HC': 'D5',
  } as const

  const targetContainerTypes = ['d2', 'd4', 'd5'] as const

  for (const targetType of targetContainerTypes) {
    let matched = false
    let minRate = 0
    let maxRate = 0
    let minTon = Number.POSITIVE_INFINITY
    let maxTon = Number.NEGATIVE_INFINITY

    // Get the weight for this container type and convert to metric tons
    const stdContainerType =
      targetType === 'd2' ? '20STD' : targetType === 'd4' ? '40STD' : '40HC'
    const weight = fcl_weights[stdContainerType]
    const ton = weightTOMetricTon({ weight: weight || 0, unit: fcl_unit })

    for (const haulage of haulageRates) {
      //TODO: fix / in container haulage rail database database
      const haulageTypes = haulage.container_type.split('/') as Array<
        'D2' | 'D4' | 'D5'
      >
      const expectedHaulageType = containerMapping[stdContainerType]

      if (haulageTypes.includes(expectedHaulageType)) {
        if (haulage.min <= ton && ton < haulage.max) {
          filteredHaulageRate[targetType] = haulage.rate
          matched = true
        }

        if (haulage.min < minTon) {
          minTon = haulage.min
        }
        if (haulage.rate < minRate) {
          minRate = haulage.rate
        }
        if (haulage.max > maxTon) {
          maxTon = haulage.max
        }
        if (haulage.rate > maxRate) {
          maxRate = haulage.rate
        }
      }
    }

    if (!matched) {
      filteredHaulageRate[targetType] = ton < 1 ? minRate : maxRate
    }
  }

  if (
    !filteredHaulageRate.d2 &&
    !filteredHaulageRate.d4 &&
    !filteredHaulageRate.d5
  ) {
    throw new Error("Couldn't find rates for rails")
  }

  // Add profit margin
  filteredHaulageRate.d2 =
    filteredHaulageRate.d2 * (fcl_quantities['20STD'] || 0) + BLOK_RAIL_PROFIT
  filteredHaulageRate.d4 =
    filteredHaulageRate.d4 * (fcl_quantities['40STD'] || 0) + BLOK_RAIL_PROFIT
  filteredHaulageRate.d5 =
    filteredHaulageRate.d5 * (fcl_quantities['40HC'] || 0) + BLOK_RAIL_PROFIT
  filteredHaulageRate.total =
    filteredHaulageRate.d2 + filteredHaulageRate.d4 + filteredHaulageRate.d5

  return filteredHaulageRate
}
