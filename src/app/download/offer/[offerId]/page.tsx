import NotFound from '@/app/not-found'
import { QuoteDataTable } from '@/components/data-table/quote-data-table'
import { QuoteTemplate } from '@/components/quote-output-template'
import React from 'react'
import { PdfType } from '@/types/common'
import { convertDToStdContainer } from '@/lib/container'
import { getOfferById } from '@/data/offer/offer'
import { getTotalSeaFclCostAndCharges } from '@/lib/sea-fcl-util'
import { LabeledCost } from '@/models/offer/shared-types'
import { QuotePdfDownloadBtn } from '../../_component/quote-pdf-download-btn'
import { DContainerTypeSmallCase } from '@/types/containers'
import SeaFclComponent from '../_components/sea-fcl-component'
import SeaDGComponent from '../_components/sea-dg-component'
import { getUserById } from '@/data/user'
import SeaIgComponent from '../_components/sea-ig-component'
import { getTotalSeaGaugeCostAndCharges } from '@/lib/sea-gauge'

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ offerId: string }>
  searchParams: Promise<{
    line_name: string
    container_type: string
    currency: string
  }>
}) {
  const param = await params
  const searchParam = await searchParams
  const offerId = param.offerId
  const lineName = (searchParam.line_name ?? '').toLowerCase()
  const fclContainerType = (searchParam.container_type ?? '').toLowerCase()
  const currency = (searchParam.currency ?? 'INR') as 'INR' | 'USD'
  console.log({ lineName, offerId })
  const offer = await getOfferById(offerId).catch((err: any) => {
    console.log(`couldn't find offer:${offerId}\nerror details:${err}`)
  })
  if (!offer) return <NotFound message={`couldn't find offer:${offerId}`} />
  const user = await getUserById(offer.user_id)
  if (!user) return <NotFound message={`couldn't find user:${offer.user_id}`} />
  let totalCost: number = 0
  let totalCharges: LabeledCost[] = []
  let containerLabel: string = ''
  let containerType
  let subject: string = ''
  if (offer.mode === 'SEA_FCL') {
    // console.log({ lines: offer.offers.line_charges })
    const linesFreightRates = offer.offers.line_charges.find(
      (line) => line.line_name === lineName
    )?.data
    // console.log({ linesFreightRates: linesFreightRates })
    if (!linesFreightRates)
      return (
        <NotFound
          message={`couldn't find line:${lineName} in offer:${offerId}`}
        />
      )
    subject = `${offer.subject} ${lineName.toUpperCase()}`
    const localsRates = offer.offers.local_charges
    containerType = fclContainerType as DContainerTypeSmallCase
    containerLabel = convertDToStdContainer(containerType)
    const { totalCharges: totalChargesSeaFcl } = getTotalSeaFclCostAndCharges(
      [linesFreightRates],
      localsRates,
      currency
    )
    totalCost = totalChargesSeaFcl.reduce(
      (acc, charge) => acc + charge.total,
      0
    )
    return (
      <SeaFclComponent
        offerId={offerId}
        lineName={lineName}
        subject={subject}
        offer={{
          ...offer,
          user: { name: user.name ?? '', companyName: user.companyName ?? '' },
        }}
        totalCharges={totalChargesSeaFcl}
        containerDetails={offer.container_details}
        totalCost={totalCost}
        currency={currency}
      />
    )
  } else if (offer.mode === 'SEA_DG') {
    const linesFreightRates = offer.offers.line_charges.find(
      (line) => line.line_name === lineName
    )?.data
    // console.log({ linesFreightRates: linesFreightRates })
    if (!linesFreightRates)
      return (
        <NotFound
          message={`couldn't find line:${lineName} in offer:${offerId}`}
        />
      )
    subject = `${offer.subject} ${lineName.toUpperCase()}`
    const localsRates = offer.offers.local_charges
    containerType = fclContainerType as DContainerTypeSmallCase
    containerLabel = convertDToStdContainer(containerType)
    const { totalCharges: totalChargesSeaFcl } = getTotalSeaFclCostAndCharges(
      [linesFreightRates],
      localsRates,
      currency
    )
    totalCost = totalChargesSeaFcl.reduce(
      (acc, charge) => acc + charge.total,
      0
    )
    return (
      <SeaDGComponent
        offerId={offerId}
        lineName={lineName}
        subject={subject}
        offer={{
          ...offer,
          user: { name: user.name ?? '', companyName: user.companyName ?? '' },
        }}
        totalCharges={totalChargesSeaFcl}
        containerDetails={offer.container_details}
        totalCost={totalCost}
        currency={currency}
      />
    )
  } else if (offer.mode === 'SEA_IG') {
    const lineChargesData = offer.offers.line_charges.find(
      (line) => line.line_name === lineName
    )?.data
    // console.log({ linesFreightRates: linesFreightRates })
    if (!lineChargesData)
      return (
        <NotFound
          message={`couldn't find line:${lineName} in offer:${offerId}`}
        />
      )
    subject = `${offer.subject} ${lineName.toUpperCase()}`
    const localsRates = offer.offers.local_charges
    containerType = fclContainerType as DContainerTypeSmallCase
    containerLabel = convertDToStdContainer(containerType)
    const { totalCharges: totalChargesSeaIg } = getTotalSeaGaugeCostAndCharges(
      [lineChargesData],
      localsRates,
      currency
    )
    totalCost = totalChargesSeaIg.reduce((acc, charge) => acc + charge.total, 0)
    return (
      <SeaIgComponent
        offerId={offerId}
        lineName={lineName}
        subject={subject}
        offer={{
          ...offer,
          user: { name: user.name ?? '', companyName: user.companyName ?? '' },
        }}
        totalCharges={totalChargesSeaIg}
        containerDetails={offer.container_details}
        totalCost={totalCost}
        currency={currency as 'INR' | 'USD'}
      />
    )
  } else if (offer.mode === 'WAR') {
    subject = offer.subject
    totalCost = offer.total_cost.inr
    totalCharges = offer.offers
    containerLabel = offer.package_type
    containerType = offer.package_type
  } else if (offer.mode === 'LAND') {
    subject = offer.subject
    totalCost = offer.total_cost.inr
    totalCharges = offer.offers
    containerLabel = offer.package_type
    containerType = offer.package_type
  } else if (offer.mode === 'AIR') {
    subject = offer.subject
    totalCost = offer.total_cost.inr
    totalCharges = offer.offers
    containerLabel = offer.package_type
    containerType = offer.package_type
  } else if (offer.mode === 'SEA_LCL') {
    subject = offer.subject
    totalCost = offer.total_cost.inr
    totalCharges = offer.offers
    containerLabel = offer.package_type
    containerType = offer.package_type
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center">
        <QuotePdfDownloadBtn
          id={offerId}
          type={PdfType.CONFIRMED_QUOTE}
          lineName={lineName}
          currency={currency}
        />
        <div className="m-0 flex w-screen flex-col items-center border-2 border-slate-200 lg:m-5">
          <QuoteTemplate
            blok_quoteId={offer.blok_id}
            billTo={{
              name: user.name ?? '',
              company: user.companyName ?? '',
              address: offer.bill_to,
            }}
            validFrom={offer.created_at?.toISOString() ?? ''}
            validTo={offer.created_at?.toISOString() ?? ''}
            placeOfSupply={offer.place_of_supply}
            shipTo={offer.bill_to}
            subject={subject}
          >
            <QuoteDataTable
              data={totalCharges}
              containerType={containerLabel}
              total={totalCost}
            />
          </QuoteTemplate>
        </div>
      </div>
    </main>
  )
}
