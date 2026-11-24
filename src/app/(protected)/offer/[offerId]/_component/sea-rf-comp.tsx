'use client'
import { useState, useMemo } from 'react'
import { OfferSeaFclDataTable } from '@/components/data-table/offer-sea-fcl-data-table'
import ShippingCard from '@/components/shared/shipping-card'
import { getTotalSeaFclCostAndCharges } from '@/lib/sea-fcl-util'
import {
  // ContainerType,
  ContainerCost,
  TotalCostByContainerType,
  Location,
  ServiceType,
  ContainerDetailsType,
} from '@/models/offer/shared-types'
// import { STDContainerType } from '@/types/containers'
import {
  SeaFclFilters,
  FilterState,
} from '@/components/filters/sea-fcl-filters'
import {
  filterAndSortOffers,
  getAvailableCarriers,
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

interface SeaRFCompProps {
  id: string
  linesFreightRates: ActualLineChargeData[]
  localCharges: ContainerCost[]
  containerTypes: string[]
  containerDetails: ContainerDetailsType
  weightUnit?: 'KG' | 'LBS'
  locations: Location[]
  service_type: ServiceType
  tags: string[]
  offerId: string
}
export function SeaRFComp({
  id,
  linesFreightRates,
  localCharges,
  containerTypes,
  containerDetails,
  // weightUnit : _weightUnit, //not used
  service_type,
  tags,
  locations,
  offerId,
}: SeaRFCompProps) {
  const availableCarriers = useMemo(
    () => getAvailableCarriers(linesFreightRates),
    [linesFreightRates]
  )

  const [filters, setFilters] = useState<FilterState>({
    sort: 'cheapest',
    carrier: 'all',
    currency: 'USD',
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
  // const availableContainers = useMemo(
  //   () =>
  //     containerTypes
  //       .map(
  //         (
  //           containerType
  //         ): {
  //           dType: ContainerType
  //           stdType: STDContainerType
  //           containerType: string
  //           containerTags: string[]
  //         } | null => {
  //           // Map FCL container types to D types
  //           const containerMap: Record<string, ContainerType> = {
  //             '20STD': 'd2',
  //             '40STD': 'd4',
  //             '40HC': 'd5',
  //           }

  //           const dType = containerMap[containerType] as ContainerType
  //           if (!dType) return null

  //           // Check if this container has quantity > 0
  //           const quantity = containerDetails[dType]?.quantity ?? 0
  //           if (quantity <= 0) return null

  //           return {
  //             dType,
  //             stdType: containerType as STDContainerType,
  //             containerType: containerType,
  //             containerTags: [
  //               `${quantity} x ${containerType}`,
  //               `${containerDetails[dType]?.weight ?? 0} ${weightUnit}`,
  //               ...tags,
  //             ],
  //           }
  //         }
  //       )
  //       .filter(
  //         (container): container is NonNullable<typeof container> =>
  //           container !== null
  //       ),
  //   [containerTypes, containerDetails, weightUnit, tags]
  // )

  // Calculate total offers count for display
  const totalOffersCount = useMemo(() => {
    let count = filteredLinesFreightRates.length
    return count
  }, [filteredLinesFreightRates])

  return (
    <div className="flex h-full w-full flex-col gap-5">
      {/* Filters Section */}
      <SeaFclFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableCarriers={availableCarriers}
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
        filteredLinesFreightRates.map((line, lineIdx) => {
          const containerLabels = {
            d2:
              containerTypes.includes('20STD') && containerDetails?.d2
                ? `20 STD x ${containerDetails.d2.quantity}`
                : null,
            d4:
              containerTypes.includes('40STD') && containerDetails?.d4
                ? `40 STD x ${containerDetails.d4.quantity}`
                : null,
            d5:
              containerTypes.includes('40HC') && containerDetails?.d5
                ? `40 HC x ${containerDetails.d5.quantity}`
                : null,
          }

          const { totalCharges } = getTotalSeaFclCostAndCharges(
            [line.data],
            localCharges,
            filters.currency
          )
          const formatedValidity = new Date(line.valid_to).toLocaleDateString(
            'en-US',
            { month: 'short', day: 'numeric', year: 'numeric' }
          )

          const today = new Date().setHours(0, 0, 0, 0)
          const isValid = new Date(line.valid_to).getTime() > today
          return (
            <div key={lineIdx} className="flex flex-col gap-3">
              <ShippingCard
                key={`${lineIdx}`}
                id={id}
                lineName={line.line_name?.toUpperCase() ?? ''}
                locations={locations}
                transportMode={service_type.toUpperCase()}
                modeType="SEA_FCL"
                serviceType={service_type}
                tags={tags}
                portToDays={line.port_to_days ?? 0}
                containerLabel={''}
                containerType={''}
                price={
                  filters.currency === 'USD'
                    ? (line.cost_breakdown?.freight_cost?.usd['total'] ?? 0)
                    : (line.cost_breakdown?.freight_cost?.inr['total'] ?? 0)
                }
                localCost={
                  filters.currency === 'USD'
                    ? (line.cost_breakdown?.local_cost?.usd['total'] ?? 0)
                    : (line.cost_breakdown?.local_cost?.inr['total'] ?? 0)
                }
                currency={filters.currency}
                url={`/api/confirmed-quote`}
                validityDate={formatedValidity}
                isValid={isValid}
                offerId={offerId}
              >
                <OfferSeaFclDataTable
                  data={totalCharges}
                  grandTotal={
                    filters.currency === 'USD'
                      ? (line.cost_breakdown?.total_cost?.usd['total'] ?? 0)
                      : (line.cost_breakdown?.total_cost?.inr['total'] ?? 0)
                  }
                  currency={filters.currency}
                  containerLabels={containerLabels}
                />
              </ShippingCard>
            </div>
          )
        })
      )}
    </div>
  )
}
