'use client'
import { OfferDataTableNew } from '@/components/data-table/offer-data-table-new'
import ShippingCard from '@/components/shared/shipping-card'
import { seaLclFilterAndSort } from '@/lib/sea-lcl-filter-utils'
import {
  LabeledCost,
  Location,
  ServiceType,
  TotalCost,
} from '@/models/offer/shared-types'
import { useMemo, useState } from 'react'

interface WarehouseCompProps {
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
export default function WarehouseComp({
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
  mode: _ = 'WAR',
}: WarehouseCompProps) {
  const [filterState, setFilterState] = useState<IFilterState>({
    currency: 'USD',
  })
  const filteredOffer = useMemo(() => {
    return seaLclFilterAndSort({
      data: offers,
      filterState: filterState,
    })
  }, [offers, filterState])
  const grandTotal =
    filterState.currency == 'USD' ? totalCost.usd : totalCost.inr
  return (
    <ShippingCard
      id={id}
      lineName={carrier}
      locations={locations}
      transportMode={service_type.toUpperCase()}
      modeType="WAR"
      serviceType={service_type}
      tags={tags}
      portToDays={0}
      containerLabel={containerLabel}
      containerType={containerType}
      price={grandTotal}
      currency={filterState.currency}
      url={`/api/confirmed-quote`}
      offerId={offerId}
    >
      <OfferDataTableNew
        data={filteredOffer}
        containerType={''}
        grandTotal={grandTotal}
        currency={filterState.currency}
      />
    </ShippingCard>
  )
}
