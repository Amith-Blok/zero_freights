import { OfferDataTable } from '@/components/data-table/offer-data-table'
import ShippingCard from '@/components/shared/shipping-card'
import { currencyConverter } from '@/lib/exchange'
import {
  ContainerType,
  LabeledCost,
  LineChargeData,
  Location,
} from '@/models/offer/shared-types'
import { STDContainerType } from '@/types/containers'

interface SeaFclCompProps {
  linesFreightRates: LineChargeData[]
  localCharges: LabeledCost[]
  containerType: ContainerType
  containerLabel: STDContainerType
  locations: Location[]
  tags: string
  offerId: string
}
export function SeaFclComp({
  linesFreightRates,
  localCharges,
  containerType,
  containerLabel,
  tags,
  locations,
  offerId,
}: SeaFclCompProps) {
  return (
    <div className="flex h-full w-full flex-col gap-5">
      {linesFreightRates.map((line, idx) => {
        const lineCharge = [line.data].map((rate) => ({
          label: rate.label,
          inr: currencyConverter({
            cost: rate[containerType],
            sourceCurrency: rate.currency as any,
            targetCurrency: 'INR',
          }),
          usd: currencyConverter({
            cost: rate[containerType],
            sourceCurrency: rate.currency as any,
            targetCurrency: 'USD',
          }),
        }))
        const charges = [...lineCharge, ...localCharges]
        const total = charges.reduce((acc, charge) => {
          return (acc += charge.inr)
        }, 0)

        return (
          <ShippingCard
            key={idx}
            lineName={line.line_name?.toUpperCase() ?? ''}
            locations={locations}
            transportMode={tags.toUpperCase()}
            modeType="SEA_FCL"
            deliveryType="port_to_port"
            estimatedDays={line.estimated_days ?? 0}
            portToDays={line.port_to_days ?? 0}
            containerLabel={containerLabel}
            containerType={containerType}
            price={line.total_cost.inr[containerType] ?? 0}
            currency="₹"
            url={`/api/confirmed-quote`}
            offerId={offerId}
          >
            <OfferDataTable
              data={[...lineCharge, ...localCharges]}
              containerType={containerLabel}
              total={total}
            />
          </ShippingCard>
        )
      })}
    </div>
  )
}
