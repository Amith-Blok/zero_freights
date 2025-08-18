'use client'
import { useState, useMemo } from 'react'
import { OfferDataTable } from '@/components/data-table/offer-data-table'
import ShippingCard from '@/components/shared/shipping-card'
import { getTotalSeaFclCostAndCharges } from '@/lib/sea-fcl-util'
import {
  ContainerType,
  ContainerCost,
  TotalCostByContainerType,
  Location,
  ServiceType,
} from '@/models/offer/shared-types'
import { STDContainerType } from '@/types/containers'
import {
  SeaFclFilters,
  FilterState,
} from '@/components/filters/sea-fcl-filters'
import {
  filterAndSortOffers,
  getAvailableCarriers,
  getPriceRange,
} from '@/lib/sea-fcl-filter-utils'

// Actual line charge data structure from the API
interface ActualLineChargeData {
  line_name: string
  port_to_days: number
  valid_to: string
  estimated_days?: number
  cost_breakdown: TotalCostByContainerType
  data: ContainerCost
}

interface SeaFclCompProps {
  id: string
  linesFreightRates: ActualLineChargeData[]
  localCharges: ContainerCost[]
  containerTypes: string[]
  containerDetails: {
    d2?: number[]
    d4?: number[]
    d5?: number[]
  }
  weightUnit: 'KG' | 'LBS'
  locations: Location[]
  service_type: ServiceType
  tags: string[]
  offerId: string
}
export function SeaFclComp({
  id,
  linesFreightRates,
  localCharges,
  containerTypes,
  containerDetails,
  weightUnit,
  service_type,
  tags,
  locations,
  offerId,
}: SeaFclCompProps) {
  // Initialize filter state
  const [priceMin, priceMax] = useMemo(
    () => getPriceRange(linesFreightRates, containerTypes, containerDetails),
    [linesFreightRates, containerTypes, containerDetails]
  )

  const availableCarriers = useMemo(
    () => getAvailableCarriers(linesFreightRates),
    [linesFreightRates]
  )

  const [filters, setFilters] = useState<FilterState>({
    sort: 'cheapest',
    container: 'all',
    carrier: 'all',
    currency: 'USD',
    priceRange: [priceMin, priceMax],
    transitTime: 'all',
    quickFilters: {
      cheapest: false,
      fastest: false,
      twentyFtOnly: false,
      fortyFtOnly: false,
    },
  })

  // Apply filters to get filtered lines
  const filteredLinesFreightRates = useMemo(
    () =>
      filterAndSortOffers(
        linesFreightRates,
        containerTypes,
        containerDetails,
        filters
      ),
    [linesFreightRates, containerTypes, containerDetails, filters]
  )

  // Convert container types to D types and filter only those with quantities > 0
  const availableContainers = useMemo(
    () =>
      containerTypes
        .map(
          (
            containerType
          ): {
            dType: ContainerType
            stdType: STDContainerType
            containerType: string
            containerTags: string[]
          } | null => {
            // Map FCL container types to D types
            const containerMap: Record<string, ContainerType> = {
              '20STD': 'd2',
              '40STD': 'd4',
              '40HC': 'd5',
            }

            const dType = containerMap[containerType] as ContainerType
            if (!dType) return null

            // Check if this container has quantity > 0
            const quantity = containerDetails[dType]?.[0] ?? 0
            if (quantity <= 0) return null

            // Apply container filter
            if (
              filters.container !== 'all' &&
              containerType !== filters.container
            ) {
              return null
            }

            return {
              dType,
              stdType: containerType as STDContainerType,
              containerType: containerType,
              containerTags: [
                `${quantity} x ${containerType}`,
                `${containerDetails[dType]?.[1] ?? 0} ${weightUnit}`,
                ...tags,
              ],
            }
          }
        )
        .filter(
          (container): container is NonNullable<typeof container> =>
            container !== null
        ),
    [containerTypes, containerDetails, weightUnit, tags, filters.container]
  )

  // Calculate total offers count for display
  const totalOffersCount = useMemo(() => {
    let count = 0
    filteredLinesFreightRates.forEach(() => {
      count += availableContainers.length
    })
    return count
  }, [filteredLinesFreightRates, availableContainers])

  return (
    <div className="flex h-full w-full flex-col gap-5">
      {/* Filters Section */}
      <SeaFclFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableCarriers={availableCarriers}
        priceMin={priceMin}
        priceMax={priceMax}
        offersCount={totalOffersCount}
      />

      {/* Offers Section */}
      {filteredLinesFreightRates.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-2 text-lg text-gray-500">No offers found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your filters to see more results
            </div>
          </div>
        </div>
      ) : (
        filteredLinesFreightRates.map((line, lineIdx) => (
          <div key={lineIdx} className="flex flex-col gap-3">
            {availableContainers.map((container, containerIdx) => {
              const { totalCost: _, totalCharges } =
                getTotalSeaFclCostAndCharges(
                  [line.data],
                  container.dType,
                  localCharges
                )
              return (
                <ShippingCard
                  key={`${lineIdx}-${containerIdx}`}
                  id={id}
                  lineName={line.line_name?.toUpperCase() ?? ''}
                  locations={locations}
                  transportMode={service_type.toUpperCase()}
                  modeType="SEA_FCL"
                  serviceType={service_type}
                  tags={container.containerTags}
                  portToDays={line.port_to_days ?? 0}
                  containerLabel={container.stdType}
                  containerType={container.dType}
                  price={
                    filters.currency === 'USD'
                      ? (line.cost_breakdown?.freight_cost?.usd[
                          container.dType
                        ] ?? 0)
                      : (line.cost_breakdown?.freight_cost?.inr[
                          container.dType
                        ] ?? 0)
                  }
                  localCost={
                    filters.currency === 'USD'
                      ? (line.cost_breakdown?.local_cost?.usd[
                          container.dType
                        ] ?? 0)
                      : (line.cost_breakdown?.local_cost?.inr[
                          container.dType
                        ] ?? 0)
                  }
                  currency={filters.currency}
                  url={`/api/confirmed-quote`}
                  offerId={offerId}
                >
                  <OfferDataTable
                    data={totalCharges}
                    containerType={container.stdType}
                    total={
                      filters.currency === 'USD'
                        ? (line.cost_breakdown?.total_cost?.usd[
                            container.dType
                          ] ?? 0)
                        : (line.cost_breakdown?.total_cost?.inr[
                            container.dType
                          ] ?? 0)
                    }
                    currency={filters.currency}
                  />
                </ShippingCard>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}
