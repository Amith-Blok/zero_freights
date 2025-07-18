import NotFound from '@/app/not-found'
import { QuoteDataTable } from '@/components/data-table/quote-data-table'
import { QuoteTemplate } from '@/components/quote-output-template'
import React from 'react'
import { QuotePdfDownloadBtn } from '../../_component/quote-pdf-download-btn'
import { getConfirmedQuoteById } from '@/data/confirmed-quote'
import { PdfType } from '@/types/common'

export default async function QuotePage(props: {
  params: Promise<{ confirmId: string }>
  searchParams: Promise<{ quoteId: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const confirmId = params.confirmId as string
  const quoteId = searchParams.quoteId as string
  const quote = await getConfirmedQuoteById(confirmId).catch((err: any) => {
    console.log(`couldn't find quote:${confirmId}\nerror details:${err}`)
  })
  if (!quote) return <NotFound message={`couldn't find quote:${confirmId}`} />

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center">
        <QuotePdfDownloadBtn
          id={quoteId}
          type={PdfType.OFFER}
          lineName={quote.subject}
        />
        <div className="m-0 flex w-screen flex-col items-center border-2 border-slate-200 lg:m-5">
          <QuoteTemplate
            blok_quoteId={''}
            billTo={{
              name: quote.user.name ?? '',
              company: quote.user.company ?? '',
              address: quote.bill_to,
            }}
            validFrom={quote.offer_date}
            validTo={quote.offer_date}
            placeOfSupply={quote.place_of_supply}
            shipTo={quote.bill_to}
            subject={quote.subject}
          >
            <QuoteDataTable
              data={quote.data}
              containerType={quote.container_type}
              total={quote.total_cost.inr}
            />
          </QuoteTemplate>
        </div>
      </div>
    </main>
  )
}
