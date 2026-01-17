'use client'
import { OfferDataTableNew } from '@/components/data-table/offer-data-table-new'
import { SeaLclFilters } from '@/components/filters/sea-lcl-filters'
import ShippingCard from '@/components/shared/shipping-card'
import { seaLclFilterAndSort } from '@/lib/sea-lcl-filter-utils'
import {
  LabeledCost,
  Location,
  ServiceType,
  TotalCost,
} from '@/models/offer/shared-types'
import { useMemo, useState } from 'react'

interface LandCompProps {
  id: string
  carrier: string
  offers: LabeledCost[]
  service_type: ServiceType
  tags: string[]
  locations: Location[]
  containerType: string
  containerLabel: string
  offerId: string
  mode: string
  totalCost: TotalCost
}
interface IFilterState {
  currency: 'USD' | 'INR'
}
export default function LandComp({
  id,
  offers,
  carrier,
  service_type,
  tags,
  locations,
  containerType,
  containerLabel,
  offerId,
  totalCost,
  mode: _ = 'LAND',
}: LandCompProps) {
  const [filterState, setFilterState] = useState<IFilterState>({
    currency: 'USD',
  })
  const filteredOffer = useMemo(() => {
    return seaLclFilterAndSort({ data: offers, filterState: filterState })
  }, [offers, filterState])

  const grandTotal =
    filterState.currency === 'USD' ? totalCost.usd : totalCost.inr

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <SeaLclFilters
        filters={filterState}
        onFiltersChange={setFilterState}
        offersCount={1}
      />
      <ShippingCard
        id={id}
        lineName={carrier}
        locations={locations}
        transportMode={service_type.toUpperCase()}
        modeType="LAND"
        serviceType={service_type}
        tags={tags}
        portToDays={0}
        containerLabel={containerLabel}
        containerType={containerType}
        price={grandTotal}
        url={`/api/confirmed-quote`}
        offerId={offerId}
        currency={filterState.currency}
      >
        <OfferDataTableNew
          data={filteredOffer}
          containerType={''}
          grandTotal={grandTotal}
          currency={filterState.currency}
        />
      </ShippingCard>
    </div>
  )
}
