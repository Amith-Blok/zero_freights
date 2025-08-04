import { CardWrapper } from '@/components/shared/card-wrapper'
import { fclContainerToDContainer } from '@/lib/utils'
import React from 'react'
import { convertDToStdContainer } from '@/lib/container'
import { getOfferById } from '@/data/offer/offer'
import { SeaFclComp } from './_component/sea-fcl-comp'
import WarehouseComp from './_component/warehouse-comp'
import LandComp from './_component/land-comp'
import AirComp from './_component/air-comp'
import SeaLclComp from './_component/sea-lcl-comp'

export default async function OfferPage(props: {
  params: Promise<{ offerId: string }>
}) {
  const param = await props.params
  const id = param.offerId

  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Offers"
        cardDescription={`Secure the finest rates available from the industry's premier
      logistics providers.`}
        titleClass="text-2xl"
        cardClass="my-5 md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        <OfferComp id={id} />
      </CardWrapper>
    </div>
  )
}

const OfferComp = async ({ id }: { id: string }) => {
  const offers = await getOfferById(id)
  if (offers.mode === 'SEA_FCL') {
    const linesFreightRates = offers.offers.line_charges
    const localsRates = offers.offers.local_charges
    const containerType = fclContainerToDContainer(
      offers.container_type
    ).toLowerCase() as 'd2' | 'd4' | 'd5'
    const containerLabel = convertDToStdContainer(containerType)

    return (
      <SeaFclComp
        id={id}
        locations={offers.locations}
        linesFreightRates={linesFreightRates}
        containerType={containerType}
        containerLabel={containerLabel}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        localCharges={localsRates}
      />
    )
  } else if (offers.mode === 'WAR') {
    const { package_type, carrier } = offers
    return (
      <WarehouseComp
        id={id}
        mode="WAR"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
      />
    )
  }
  if (offers.mode === 'LAND') {
    const { package_type, carrier } = offers
    return (
      <LandComp
        id={id}
        mode="LAND"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
      />
    )
  } else if (offers.mode === 'AIR') {
    const { package_type, carrier, estimated_days } = offers
    return (
      <AirComp
        id={id}
        mode="AIR"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
        estimatedDays={estimated_days}
      />
    )
  } else if (offers.mode === 'SEA_LCL') {
    const { package_type, carrier } = offers
    return (
      <SeaLclComp
        id={id}
        mode="SEA_LCL"
        locations={offers.locations}
        containerType={package_type}
        containerLabel={package_type}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        offers={offers.offers}
        carrier={carrier}
        price={offers.total_cost.inr}
      />
    )
  } else {
    return null
  }
}
