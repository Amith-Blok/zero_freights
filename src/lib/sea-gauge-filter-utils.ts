import { FilterState } from '@/components/filters/sea-gauge-filters'
import {
  IgContainerCost,
  IgContainerDetailsType,
  TotatCostByIgContainerType,
} from '@/models/offer/shared-types'
import { currencyConverter } from './exchange'

// Actual line charge data structure from the API for Sea IG (In Gauge)
export interface ActualIgLineChargeData {
  line_name: string
  port_to_days: number
  valid_to: string
  estimated_days?: number
  cost_breakdown: TotatCostByIgContainerType
  data: IgContainerCost
}

export interface FilteredIgOfferData {
  lineData: ActualIgLineChargeData
  containerType: string
  price: number
  transitDays: number
  carrier: string
}

export function filterAndSortIgOffers(
  linesFreightRates: ActualIgLineChargeData[],
  containerTypes: string[],
  containerDetails: IgContainerDetailsType,
  filters: FilterState
): ActualIgLineChargeData[] {
  // First, create a flat list of all offers
  const allOffers: FilteredIgOfferData[] = []

  linesFreightRates.forEach((line) => {
    containerTypes.forEach((containerType) => {
      // Map standard container types to IG container type keys
      const containerMap: Record<
        string,
        'ot2' | 'ot4' | 'fr2' | 'fr4' | 'fr5'
      > = {
        OT20: 'ot2', // Open Top 20'
        OT40: 'ot4', // Open Top 40'
        FR20: 'fr2', // Flat Rack 20'
        FR40: 'fr4', // Flat Rack 40'
        FR45: 'fr5', // Flat Rack 45' HC
      }

      const igType = containerMap[containerType]
      if (!igType) return

      // Check if this container has quantity > 0
      const quantity = containerDetails[igType]?.quantity ?? 0
      if (quantity <= 0) return

      const price =
        filters.currency === 'USD'
          ? (line.cost_breakdown?.total_cost?.usd?.[igType] ?? 0)
          : (line.cost_breakdown?.total_cost?.inr?.[igType] ?? 0)
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
  const result: ActualIgLineChargeData[] = []

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

export function getAvailableIgCarriers(
  linesFreightRates: ActualIgLineChargeData[]
): string[] {
  const carriers = new Set<string>()
  linesFreightRates.forEach((line) => {
    if (line.line_name) {
      carriers.add(line.line_name.toUpperCase())
    }
  })
  return Array.from(carriers).sort()
}

export function getIgPriceRange(
  linesFreightRates: ActualIgLineChargeData[],
  containerTypes: string[],
  containerDetails: IgContainerDetailsType
): [number, number] {
  let minPrice = Infinity
  let maxPrice = -Infinity

  linesFreightRates.forEach((line) => {
    containerTypes.forEach((containerType) => {
      const containerMap: Record<
        string,
        'ot2' | 'ot4' | 'fr2' | 'fr4' | 'fr5'
      > = {
        OT20: 'ot2',
        OT40: 'ot4',
        FR20: 'fr2',
        FR40: 'fr4',
        FR45: 'fr5',
      }

      const igType = containerMap[containerType]
      if (!igType) return

      const quantity = containerDetails[igType]?.quantity ?? 0
      if (quantity <= 0) return

      const price = line.cost_breakdown?.total_cost?.inr[igType] ?? 0
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

export const getTargetCurrencyGaugeDataTableData = (
  charges: IgContainerCost[],
  currency: 'INR' | 'USD'
) => {
  return charges.map((charge) => ({
    label: charge.label,
    currency: charge.currency as 'INR' | 'USD',
    ot2: currencyConverter({
      cost: charge.ot2,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    ot4: currencyConverter({
      cost: charge.ot4,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    fr2: currencyConverter({
      cost: charge.fr2,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    fr4: currencyConverter({
      cost: charge.fr4,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    fr5: currencyConverter({
      cost: charge.fr5,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    total: currencyConverter({
      cost: charge.total,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
  }))
}
