import { OfferDataTable } from '@/components/data-table/offer-data-table'
import ShippingCard from '@/components/shared/shipping-card'
import { getTotalSeaFclCostAndCharges } from '@/lib/sea-fcl-util'
import {
  ContainerType,
  ContainerCost,
  LineChargeData,
  Location,
  ServiceType,
} from '@/models/offer/shared-types'
import { STDContainerType } from '@/types/containers'

interface SeaFclCompProps {
  id: string
  linesFreightRates: LineChargeData[]
  localCharges: ContainerCost[]
  containerType: ContainerType
  containerLabel: STDContainerType
  locations: Location[]
  service_type: ServiceType
  tags: string[]
  offerId: string
}
export function SeaFclComp({
  id,
  linesFreightRates,
  localCharges,
  containerType,
  containerLabel,
  service_type,
  tags,
  locations,
  offerId,
}: SeaFclCompProps) {
  return (
    <div className="flex h-full w-full flex-col gap-5">
      {linesFreightRates.map((line, idx) => {
        const { totalCost, totalCharges } = getTotalSeaFclCostAndCharges(
          [line.data],
          containerType,
          localCharges
        )
        return (
          <ShippingCard
            key={idx}
            id={id}
            lineName={line.line_name?.toUpperCase() ?? ''}
            locations={locations}
            transportMode={service_type.toUpperCase()}
            modeType="SEA_FCL"
            serviceType={service_type}
            tags={tags}
            portToDays={line.port_to_days ?? 0}
            containerLabel={containerLabel}
            containerType={containerType}
            price={line.total_cost.inr[containerType] ?? 0}
            url={`/api/confirmed-quote`}
            offerId={offerId}
          >
            <OfferDataTable
              data={totalCharges}
              containerType={containerLabel}
              total={totalCost}
            />
          </ShippingCard>
        )
      })}
    </div>
  )
}
