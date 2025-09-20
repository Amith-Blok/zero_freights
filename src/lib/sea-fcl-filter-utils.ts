import { FilterState } from '@/components/filters/sea-fcl-filters'
import {
  ContainerCost,
  ContainerDetailsType,
  TotalCostByContainerType,
} from '@/models/offer/shared-types'

// Actual line charge data structure from the API
export interface ActualLineChargeData {
  line_name: string
  port_to_days: number
  valid_to: string
  estimated_days?: number
  cost_breakdown: TotalCostByContainerType
  data: ContainerCost
}

export interface FilteredOfferData {
  lineData: ActualLineChargeData
  containerType: string
  price: number
  transitDays: number
  carrier: string
}

export function filterAndSortOffers(
  linesFreightRates: ActualLineChargeData[],
  containerTypes: string[],
  containerDetails: ContainerDetailsType,
  filters: FilterState
): ActualLineChargeData[] {
  // First, create a flat list of all offers
  const allOffers: FilteredOfferData[] = []

  linesFreightRates.forEach((line) => {
    containerTypes.forEach((containerType) => {
      const containerMap: Record<string, 'd2' | 'd4' | 'd5'> = {
        '20STD': 'd2',
        '40STD': 'd4',
        '40HC': 'd5',
      }

      const dType = containerMap[containerType]
      if (!dType) return

      // Check if this container has quantity > 0
      const quantity = containerDetails[dType]?.quantity ?? 0
      if (quantity <= 0) return

      const price =
        filters.currency === 'USD'
          ? (line.cost_breakdown?.total_cost?.usd?.[dType] ?? 0)
          : (line.cost_breakdown?.total_cost?.inr?.[dType] ?? 0)
      if (price === 0) return

      allOffers.push({
        lineData: line,
        containerType,
        price,
        transitDays: line.port_to_days,
        carrier: line.line_name?.toLowerCase() ?? '',
      })
    })
  })

  // Apply filters
  let filteredOffers = allOffers.filter((offer) => {
    // Carrier filter
    if (
      filters.carrier !== 'all' &&
      offer.carrier !== filters.carrier.toLowerCase()
    ) {
      return false
    }

    return true
  })

  // Apply sorting
  if (filters.sort === 'cheapest') {
    filteredOffers.sort((a, b) => a.price - b.price)
  } else if (filters.sort === 'highest') {
    filteredOffers.sort((a, b) => b.price - a.price)
  } else if (filters.sort === 'shortest') {
    filteredOffers.sort((a, b) => a.transitDays - b.transitDays)
  } else if (filters.sort === 'longest') {
    filteredOffers.sort((a, b) => b.transitDays - a.transitDays)
  }

  // Group back by line and return unique lines
  const uniqueLines = new Set<string>()
  const result: ActualLineChargeData[] = []

  filteredOffers.forEach((offer) => {
    // Create a unique key based on line name only, since container filtering is handled separately
    const lineKey = offer.lineData.line_name
    if (!uniqueLines.has(lineKey)) {
      uniqueLines.add(lineKey)
      result.push(offer.lineData)
    }
  })

  return result
}

export function getAvailableCarriers(
  linesFreightRates: ActualLineChargeData[]
): string[] {
  const carriers = new Set<string>()
  linesFreightRates.forEach((line) => {
    if (line.line_name) {
      carriers.add(line.line_name.toUpperCase())
    }
  })
  return Array.from(carriers).sort()
}

export function getPriceRange(
  linesFreightRates: ActualLineChargeData[],
  containerTypes: string[],
  containerDetails: ContainerDetailsType
): [number, number] {
  let minPrice = Infinity
  let maxPrice = -Infinity

  linesFreightRates.forEach((line) => {
    containerTypes.forEach((containerType) => {
      const containerMap: Record<string, 'd2' | 'd4' | 'd5'> = {
        '20STD': 'd2',
        '40STD': 'd4',
        '40HC': 'd5',
      }

      const dType = containerMap[containerType]
      if (!dType) return

      const quantity = containerDetails[dType]?.quantity ?? 0
      if (quantity <= 0) return

      const price = line.cost_breakdown?.total_cost?.inr[dType] ?? 0
      if (price > 0) {
        minPrice = Math.min(minPrice, price)
        maxPrice = Math.max(maxPrice, price)
      }
    })
  })

  if (minPrice === Infinity) return [0, 0]

  // Round to nearest thousand for better UX
  minPrice = Math.floor(minPrice / 1000) * 1000
  maxPrice = Math.ceil(maxPrice / 1000) * 1000

  return [minPrice, maxPrice]
}
