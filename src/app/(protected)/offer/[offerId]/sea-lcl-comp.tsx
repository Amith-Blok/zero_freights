import { OfferDataTable } from '@/components/data-table/offer-data-table'
import ShippingCard from '@/components/shared/shipping-card'
import { LabeledCost, Location } from '@/models/offer/shared-types'

interface SeaLclProps {
  carrier: string
  offers: LabeledCost[]
  tags: string
  price: number
  locations: Location[]
  containerType: string
  containerLabel: string
  estimatedDays: number
  offerId: string
  mode: string
}
export default function SeaLclComp({
  offers,
  carrier,
  tags,
  price,
  locations,
  containerType,
  containerLabel,
  offerId,
  estimatedDays,
  mode: _ = 'SEA_LCL',
}: SeaLclProps) {
  return (
    <ShippingCard
      lineName={carrier}
      locations={locations}
      transportMode={tags.toUpperCase()}
      modeType="SEA_LCL"
      deliveryType="port_to_port"
      estimatedDays={0}
      portToDays={estimatedDays}
      containerLabel={containerLabel}
      containerType={containerType}
      price={price}
      currency="₹"
      url={`/api/confirmed-quote`}
      offerId={offerId}
    >
      <OfferDataTable data={offers} containerType={''} total={price} />
    </ShippingCard>
  )
}
