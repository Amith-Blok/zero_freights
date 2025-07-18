import NotFound from '@/app/not-found'
import { QuoteDataTable } from '@/components/data-table/quote-data-table'
import { QuoteTemplate } from '@/components/quote-output-template'
import React from 'react'
import { PdfType } from '@/types/common'
import { convertDToStdContainer } from '@/lib/container'
import { getOfferById } from '@/data/offer/offer'
import { fclContainerToDContainer } from '@/lib/utils'
import { getTotalSeaFclCostAndCharges } from '@/lib/sea-fcl-util'
import { LabeledCost } from '@/models/offer/shared-types'
import { QuotePdfDownloadBtn } from '../../_component/quote-pdf-download-btn'

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ offerId: string }>
  searchParams: Promise<{ line_name: string }>
}) {
  const param = await params
  const searchParam = await searchParams
  const offerId = param.offerId
  const lineName = (searchParam.line_name ?? '').toLowerCase()
  console.log({ lineName, offerId })
  const offer = await getOfferById(offerId).catch((err: any) => {
    console.log(`couldn't find offer:${offerId}\nerror details:${err}`)
  })
  if (!offer) return <NotFound message={`couldn't find offer:${offerId}`} />
  let totalCost: number = 0
  let totalCharges: LabeledCost[] = []
  let containerLabel: string = ''
  let containerType
  let subject: string = ''
  if (offer.mode === 'SEA_FCL') {
    console.log({ lines: offer.offers.line_charges })
    const linesFreightRates = offer.offers.line_charges.find(
      (line) => line.line_name === lineName
    )?.data
    console.log({ linesFreightRates: linesFreightRates })
    if (!linesFreightRates)
      return (
        <NotFound
          message={`couldn't find line:${lineName} in offer:${offerId}`}
        />
      )
    subject = `${offer.subject} ${lineName}`
    const localsRates = offer.offers.local_charges
    containerType = fclContainerToDContainer(
      offer.container_type
    ).toLowerCase() as 'd2' | 'd4' | 'd5'
    containerLabel = convertDToStdContainer(containerType)
    const { totalCost: totalCostSeaFcl, totalCharges: totalChargesSeaFcl } =
      getTotalSeaFclCostAndCharges(
        [linesFreightRates],
        containerType,
        localsRates
      )
    totalCost = totalCostSeaFcl
    totalCharges = totalChargesSeaFcl
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
        />
        <div className="m-0 flex w-screen flex-col items-center border-2 border-slate-200 lg:m-5">
          <QuoteTemplate
            blok_quoteId={offer.blok_id}
            billTo={{
              name: offer.user.name ?? '',
              company: offer.user.company ?? '',
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
