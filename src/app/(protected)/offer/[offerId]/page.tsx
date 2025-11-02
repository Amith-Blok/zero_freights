import { CardWrapper } from '@/components/shared/card-wrapper'
import React from 'react'
import { getOfferById } from '@/data/offer/offer'
import { SeaFclComp } from './_component/sea-fcl-comp'
import WarehouseComp from './_component/warehouse-comp'
import LandComp from './_component/land-comp'
import AirComp from './_component/air-comp'
import SeaLclComp from './_component/sea-lcl-comp'
import { SeaDGComp } from './_component/sea-dg-comp'
import { SeaRFComp } from './_component/sea-rf-comp'
import { SeaIgComp } from './_component/sea-ig-comp'
import { SeaOogComp } from './_component/sea-oog-comp'

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
    return (
      <SeaFclComp
        id={id}
        locations={offers.locations}
        linesFreightRates={linesFreightRates}
        containerTypes={offers.container_types}
        containerDetails={offers.container_details}
        weightUnit={offers.weight_unit}
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
        price={offers.total_cost.usd}
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
        price={offers.total_cost.usd}
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
        price={offers.total_cost.usd}
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
        price={offers.total_cost.usd}
      />
    )
  } else if (offers.mode === 'SEA_DG') {
    return (
      <SeaDGComp
        id={id}
        locations={offers.locations}
        linesFreightRates={offers.offers.line_charges}
        containerTypes={offers.container_types}
        containerDetails={offers.container_details}
        weightUnit={offers.weight_unit}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        localCharges={offers.offers.local_charges}
      />
    )
  } else if (offers.mode === 'SEA_RF') {
    return (
      <SeaRFComp
        id={id}
        locations={offers.locations}
        linesFreightRates={offers.offers.line_charges}
        containerTypes={offers.container_types}
        containerDetails={offers.container_details}
        weightUnit={offers.weight_unit}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        localCharges={offers.offers.local_charges}
      />
    )
  } else if (offers.mode === 'SEA_IG') {
    return (
      <SeaIgComp
        id={id}
        locations={offers.locations}
        linesFreightRates={offers.offers.line_charges}
        containerTypes={offers.container_types}
        containerDetails={offers.container_details}
        weightUnit={offers.weight_unit}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        localCharges={offers.offers.local_charges}
      />
    )
  } else if (offers.mode === 'SEA_OOG') {
    return (
      <SeaOogComp
        id={id}
        locations={offers.locations}
        linesFreightRates={offers.offers.line_charges}
        containerTypes={offers.container_types}
        containerDetails={offers.container_details}
        weightUnit={offers.weight_unit}
        service_type={offers.service_type}
        tags={offers.tags}
        offerId={offers.blok_id}
        localCharges={offers.offers.local_charges}
      />
    )
  } else {
    return null
  }
}
