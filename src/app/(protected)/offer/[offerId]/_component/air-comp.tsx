import { OfferDataTable } from '@/components/data-table/offer-data-table'
import ShippingCard from '@/components/shared/shipping-card'
import { LabeledCost, Location, ServiceType } from '@/models/offer/shared-types'

interface AirProps {
  id: string
  carrier: string
  offers: LabeledCost[]
  service_type: ServiceType
  tags: string[]
  price: number
  estimatedDays: number
  locations: Location[]
  containerType: string
  containerLabel: string
  offerId: string
  mode: string
}
export default function AirComp({
  id,
  offers,
  carrier,
  service_type,
  estimatedDays,
  tags,
  price,
  locations,
  containerType,
  containerLabel,
  offerId,
  mode: _ = 'AIR',
}: AirProps) {
  return (
    <ShippingCard
      id={id}
      lineName={carrier}
      locations={locations}
      transportMode={service_type.toUpperCase()}
      modeType="AIR"
      serviceType={service_type}
      tags={tags}
      portToDays={estimatedDays}
      containerLabel={containerLabel}
      containerType={containerType}
      currency="USD"
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
