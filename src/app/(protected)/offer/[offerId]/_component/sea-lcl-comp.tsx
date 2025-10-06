import { OfferDataTable } from '@/components/data-table/offer-data-table'
import ShippingCard from '@/components/shared/shipping-card'
import { LabeledCost, Location, ServiceType } from '@/models/offer/shared-types'

interface SeaLclProps {
  id: string
  carrier: string
  offers: LabeledCost[]
  service_type: ServiceType
  tags: string[]
  price: number
  locations: Location[]
  containerType: string
  containerLabel: string
  offerId: string
  mode: string
}
export default function SeaLclComp({
  id,
  offers,
  carrier,
  service_type,
  tags,
  price,
  locations,
  containerType,
  containerLabel,
  offerId,
  mode: _ = 'SEA_LCL',
}: SeaLclProps) {
  return (
    <ShippingCard
      id={id}
      lineName={carrier}
      locations={locations}
      transportMode={service_type.toUpperCase()}
      modeType="SEA_LCL"
      serviceType={service_type}
      tags={tags}
      portToDays={0}
      containerLabel={containerLabel}
      containerType={containerType}
      price={price}
      url={`/api/confirmed-quote`}
      offerId={offerId}
    >
      <OfferDataTable
        data={offers}
        containerType={''}
        grandTotal={price}
        currency="USD"
      />
    </ShippingCard>
  )
}
