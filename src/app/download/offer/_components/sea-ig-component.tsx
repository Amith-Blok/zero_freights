import { PdfType } from '@/types/common'
import React from 'react'
import { QuotePdfDownloadBtn } from '../../_component/quote-pdf-download-btn'
import { QuoteTemplate } from '@/components/quote-output-template'
import {
  Offer,
  IgContainerDetailsType,
  IgContainerCost,
} from '@/models/offer/shared-types'
import { OfferSeaGaugeDataTable } from '@/components/data-table/offer-sea-gauge-data-table'

interface SeaIgComponentProps {
  offerId: string
  lineName: string
  subject: string
  offer: Offer & { user: { name: string; companyName: string } }
  containerDetails: IgContainerDetailsType
  totalCharges: IgContainerCost[]
  totalCost: number
  currency: 'INR' | 'USD'
}
export default async function SeaIgComponent({
  offerId,
  lineName,
  subject,
  offer,
  totalCharges,
  containerDetails,
  totalCost,
  currency,
}: SeaIgComponentProps) {
  const containerLabels = {
    ot2:
      (containerDetails?.ot2?.quantity ?? 0) > 0
        ? `OT20 x ${containerDetails.ot2?.quantity ?? 0}`
        : null,
    ot4:
      (containerDetails?.ot4?.quantity ?? 0) > 0
        ? `OT40 x ${containerDetails.ot4?.quantity ?? 0}`
        : null,
    fr2:
      (containerDetails?.fr2?.quantity ?? 0) > 0
        ? `FR20 x ${containerDetails.fr2?.quantity ?? 0}`
        : null,
    fr4:
      (containerDetails?.fr4?.quantity ?? 0) > 0
        ? `FR40 x ${containerDetails.fr4?.quantity ?? 0}`
        : null,
    fr5:
      (containerDetails?.fr5?.quantity ?? 0) > 0
        ? `FR45 x ${containerDetails.fr5?.quantity ?? 0}`
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
              company: offer.user.companyName ?? '',
              address: offer.bill_to,
            }}
            validFrom={offer.created_at?.toISOString() ?? ''}
            validTo={offer.created_at?.toISOString() ?? ''}
            placeOfSupply={offer.place_of_supply}
            shipTo={offer.bill_to}
            subject={subject}
          >
            <OfferSeaGaugeDataTable
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
