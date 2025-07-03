import { CardWrapper } from '@/components/shared/card-wrapper'
import { currencyConverter } from '@/lib/exchange'
import { fclContainerToDContainer } from '@/lib/utils'
import React from 'react'
import { convertDToStdContainer } from '@/lib/container'
import { getOfferById } from '@/data/offer/offer'
import { SeaFclComp } from './sea-fcl-comp'
import WarehouseComp from './warehouse-comp'
import LandComp from './land-comp'
import AirComp from './air-comp'
import SeaLclComp from './sea-lcl-comp'

export default async function OfferPage(props: {
  params: Promise<{ offerId: string }>
}) {
  const param = await props.params
  const offerId = param.offerId

  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Offers"
        cardDescription={`Secure the finest rates available from the industry's premier
      logistics providers.`}
        titleClass="text-2xl"
        cardClass="my-5 md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        <OfferComp offerId={offerId} />
      </CardWrapper>
    </div>
  )
}

const OfferComp = async ({ offerId }: { offerId: string }) => {
  const offers = await getOfferById(offerId)
  if (offers.mode === 'SEA_FCL') {
    const linesFreightRates = offers.offers.line_charges
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
    return (
      <SeaFclComp
        locations={offers.locations}
        linesFreightRates={linesFreightRates}
        containerType={containerType}
        containerLabel={containerLabel}
        tags={offers.tags[0]}
        offerId={offerId}
        localCharges={filteredLocalCharges}
      />
    )
  } else if (offers.mode === 'WAR') {
    const { package_type, carrier, estimated_days } = offers
    return (
      <WarehouseComp
        mode="WAR"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        tags={offers.tags[0]}
        offerId={offerId}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
        estimatedDays={estimated_days}
      />
    )
  }
  if (offers.mode === 'LAND') {
    const { package_type, carrier } = offers
    return (
      <LandComp
        mode="LAND"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        tags={offers.tags[0]}
        offerId={offerId}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
        estimatedDays={0}
      />
    )
  } else if (offers.mode === 'AIR') {
    const { package_type, carrier } = offers
    return (
      <AirComp
        mode="AIR"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        tags={offers.tags[0]}
        offerId={offerId}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
        estimatedDays={0}
      />
    )
  } else if (offers.mode === 'SEA_LCL') {
    const { package_type, carrier } = offers
    return (
      <SeaLclComp
        mode="SEA_LCL"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        tags={offers.tags[0]}
        offerId={offerId}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
        estimatedDays={0}
      />
    )
  } else {
    return null
  }
}
