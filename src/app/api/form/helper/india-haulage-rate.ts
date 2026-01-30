// TODO: Optimise this code use base function for calculateHaulageCostByWeight

import { IndiaOutboundHaulageType } from '@/models/india-outbound-haulage'
import {
  FclQuantitiesType,
  FclWeightsType,
  FclWeightUnitType,
} from '@/schema/sea-schema'
import { weightTOMetricTon } from '@/lib/utils'

export const calculateHaulageCostByWeight = ({
  haulageRates,
  weights,
  unit,
  quantities,
}: {
  haulageRates: IndiaOutboundHaulageType[]
  weights: FclWeightsType
  unit: FclWeightUnitType
  quantities: FclQuantitiesType
}): { d2: number; d4: number; d5: number; total: number } => {
  console.log('__Filter Haulage Rate By Weight__')
  console.log({ haulageRates, weights, unit, quantities })
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
    const weight = weights[stdContainerType]
    const ton = weightTOMetricTon({ weight: weight || 0, unit: unit })

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
          minRate = haulage.rate
        }

        if (haulage.max > maxTon) {
          maxTon = haulage.max
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

  const calc = (rate: number, qty = 0) =>
    qty > 0 ? rate * qty + BLOK_RAIL_PROFIT : 0

  filteredHaulageRate.d2 = calc(filteredHaulageRate.d2, quantities['20STD'])
  filteredHaulageRate.d4 = calc(filteredHaulageRate.d4, quantities['40STD'])
  filteredHaulageRate.d5 = calc(filteredHaulageRate.d5, quantities['40HC'])

  filteredHaulageRate.total =
    filteredHaulageRate.d2 + filteredHaulageRate.d4 + filteredHaulageRate.d5

  console.log('__Filtered Haulage Rate__')
  console.log({ filteredHaulageRate })
  return filteredHaulageRate
}
export const getBaseHaulageRatesByWeight = ({
  haulageRates,
  weights,
  unit,
}: {
  haulageRates: IndiaOutboundHaulageType[]
  weights: FclWeightsType
  unit: FclWeightUnitType
}): { d2: number; d4: number; d5: number; total: number } => {
  console.log('__Filter Haulage Rate By Weight__')
  console.log({ haulageRates, weights, unit })
  const filteredHaulageRate = { d2: 0, d4: 0, d5: 0, total: 0 }

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
    const weight = weights[stdContainerType]
    const ton = weightTOMetricTon({ weight: weight || 0, unit: unit })

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
          minRate = haulage.rate
        }

        if (haulage.max > maxTon) {
          maxTon = haulage.max
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

  filteredHaulageRate.total =
    filteredHaulageRate.d2 + filteredHaulageRate.d4 + filteredHaulageRate.d5

  console.log('__Filtered Haulage Rate__')
  console.log({ filteredHaulageRate })
  return filteredHaulageRate
}
