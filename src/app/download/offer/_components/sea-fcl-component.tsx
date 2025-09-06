import { PdfType } from '@/types/common'
import React from 'react'
import { QuotePdfDownloadBtn } from '../../_component/quote-pdf-download-btn'
import { QuoteTemplate } from '@/components/quote-output-template'
import {
  ContainerCost,
  ContainerDetailsType,
  Offer,
} from '@/models/offer/shared-types'
import { OfferSeaFclDataTable } from '@/components/data-table/offer-sea-fcl-data-table'

interface SeaFclComponentProps {
  offerId: string
  lineName: string
  subject: string
  offer: Offer
  containerDetails: ContainerDetailsType
  totalCharges: ContainerCost[]
  totalCost: number
  currency: 'INR' | 'USD'
}
export default function SeaFclComponent({
  offerId,
  lineName,
  subject,
  offer,
  totalCharges,
  containerDetails,
  totalCost,
  currency,
}: SeaFclComponentProps) {
  const containerLabels = {
    d2:
      (containerDetails?.d2?.quantity ?? 0) > 0
        ? `${containerDetails.d2?.quantity} x 20 STD`
        : null,
    d4:
      (containerDetails?.d4?.quantity ?? 0) > 0
        ? `${containerDetails.d4?.quantity} x 40 STD`
        : null,
    d5:
      (containerDetails?.d5?.quantity ?? 0) > 0
        ? `${containerDetails.d5?.quantity} x 40 HC`
        : null,
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
            <OfferSeaFclDataTable
              data={totalCharges}
              containerLabels={containerLabels}
              grandTotal={totalCost}
              currency={currency}
            />
          </QuoteTemplate>
        </div>
      </div>
    </main>
  )
}
