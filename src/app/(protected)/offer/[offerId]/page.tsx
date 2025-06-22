import { OfferDataTable } from '@/components/data-table/offer-data-table'
import { CardWrapper } from '@/components/shared/card-wrapper'
import ShippingCard from '@/components/shared/shipping-card'
import { getOfferById } from '@/data/offer'
import { currencyConverter } from '@/lib/exchange'
import { fclContainerToDContainer } from '@/lib/utils'
import { LocationType, SeaFreightType } from '@/models/offers'
import { DContainerTypeSmallCase, STDContainerType } from '@/types/containers'
import React from 'react'
import { convertDToStdContainer } from '@/lib/container'

export default async function OfferPage(props: {
  params: Promise<{ offerId: string }>
}) {

  const param = await props.params
  const offerId = param.offerId
  const offers = await getOfferById(offerId)
  const linesFreightRates = offers.offers.sea_freights
  const localsRates = offers.offers.local_charges
  const containerType = fclContainerToDContainer(
    offers.container_type
  ).toLowerCase() as 'd2' | 'd4' | 'd5'
  const containerLabel = convertDToStdContainer(containerType)
  // console.log(JSON.stringify(offers, null, 2))
  // console.log({ containerType })
  const filteredLocalCharges = localsRates.map((rate) => ({
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
  // console.log({ filteredLocalCharges })
  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Offers"
        cardDescription={`Secure the finest rates available from the industry's premier
      logistics providers.`}
        titleClass="text-2xl"
        cardClass="my-5 md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        <OfferComp
          linesFreightRates={linesFreightRates}
          localCharges={filteredLocalCharges}
          containerType={containerType}
          containerLabel={containerLabel}
          tags={offers.tag}
          locations={offers.locations}
          offerId={offerId}
        />
      </CardWrapper>
    </div>
  )
}

interface OfferProps {
  linesFreightRates: SeaFreightType[]
  localCharges: { label: string; inr: number; usd: number }[]
  containerType: DContainerTypeSmallCase
  containerLabel: STDContainerType
  locations: LocationType[]
  tags: string
  offerId: string
}
function OfferComp({
  linesFreightRates,
  containerType,
  tags,
  locations,
  localCharges,
  offerId,
  containerLabel,
}: OfferProps) {
  return (
    <div className="flex h-full w-full flex-col gap-5">
      {linesFreightRates.map((line, idx) => {
        const lineCharge = line.data.map((rate) => ({
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
            deliveryType="port_to_port"
            estimatedDays={line.estimated_days ?? 0}
            portToDays={line.port_to_days ?? 0}
            containerLabel={containerLabel}
            containerType={containerType}
            price={line.total_cost?.inr[containerType] ?? 0}
            currency="₹"
            url={`/api/confirmed-quote/create`}
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
