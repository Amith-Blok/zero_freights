'use client'
import { useState, useMemo } from 'react'
import ShippingCard from '@/components/shared/shipping-card'
import {
  TotatCostByIgContainerType,
  Location,
  ServiceType,
  IgContainerDetailsType,
  IgContainerCost,
} from '@/models/offer/shared-types'

import {
  filterAndSortIgOffers,
  getAvailableIgCarriers,
} from '@/lib/sea-gauge-filter-utils'
import { OfferSeaGaugeDataTable } from '@/components/data-table/offer-sea-gauge-data-table'
import { getTotalSeaGaugeCostAndCharges } from '@/lib/sea-gauge'
import {
  SeaGaugeFilters,
  FilterState,
} from '@/components/filters/sea-gauge-filters'

// Actual line charge data structure from the API
interface ActualLineChargeData {
  line_name: string
  port_to_days: number
  valid_to: string
  estimated_days?: number
  cost_breakdown: TotatCostByIgContainerType
  data: IgContainerCost
}

interface SeaOogCompProps {
  id: string
  linesFreightRates: ActualLineChargeData[]
  localCharges: IgContainerCost[]
  containerTypes: string[]
  containerDetails: IgContainerDetailsType
  weightUnit?: 'KG' | 'LBS'
  locations: Location[]
  service_type: ServiceType
  tags: string[]
  offerId: string
}
export function SeaOogComp({
  id,
  linesFreightRates,
  localCharges,
  containerTypes,
  containerDetails,
  service_type,
  tags,
  locations,
  offerId,
}: SeaOogCompProps) {
  const availableCarriers = useMemo(
    () => getAvailableIgCarriers(linesFreightRates),
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
      filterAndSortIgOffers(
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
      <SeaGaugeFilters
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
            ot2:
              containerTypes.includes('OT20') && containerDetails?.ot2
                ? `OT20 x ${containerDetails.ot2.quantity}`
                : null,
            ot4:
              containerTypes.includes('OT40') && containerDetails?.ot4
                ? `OT40 x ${containerDetails.ot4.quantity}`
                : null,
            fr2:
              containerTypes.includes('FR20') && containerDetails?.fr2
                ? `FR20 x ${containerDetails.fr2.quantity}`
                : null,
            fr4:
              containerTypes.includes('FR40') && containerDetails?.fr4
                ? `FR40 x ${containerDetails.fr4.quantity}`
                : null,
            fr5:
              containerTypes.includes('FR45') && containerDetails?.fr5
                ? `FR45 x ${containerDetails.fr5.quantity}`
                : null,
          }

          const { totalCharges } = getTotalSeaGaugeCostAndCharges(
            [line.data] as IgContainerCost[],
            localCharges as IgContainerCost[],
            filters.currency
          )

          return (
            <div key={lineIdx} className="flex flex-col gap-3">
              <ShippingCard
                key={`${lineIdx}`}
                id={id}
                lineName={line.line_name?.toUpperCase() ?? ''}
                locations={locations}
                transportMode={service_type.toUpperCase()}
                modeType="SEA_IG"
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
                offerId={offerId}
              >
                <OfferSeaGaugeDataTable
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
