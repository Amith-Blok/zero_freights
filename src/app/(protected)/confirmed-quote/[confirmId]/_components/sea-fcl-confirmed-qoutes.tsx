import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import React from 'react'
import { ConfirmedQuoteCard } from '../confirmed-quote-card'
import { getUserById } from '@/data/user'
import { notFound } from 'next/navigation'
import { ConfirmedQuote } from '@/schema/models/confirmed-quote-new-zod'
import { OfferSeaFclDataTable } from '@/components/data-table/offer-sea-fcl-data-table'
import { getTargetCurrencySeaFclDataTableData } from '@/lib/sea-fcl-util'

export default async function SeaFclConfirmedQuotes(params: ConfirmedQuote) {
  const { mode } = params
  if (mode !== 'CONFIRMED_SEA_FCL') return notFound()
  const {
    blok_id,
    user_id,
    locations,
    carrier,
    service_type,
    data,
    container_types,
    total_cost,
  } = params
  const dbUser = await getUserById(user_id)
  if (!dbUser) return notFound()
  const userName = toTitleCase(dbUser.name ?? '')
  const userEmail = dbUser.email ?? ''
  const userPhone = formatPhoneNumber(dbUser.phone ?? '')
  const userCompany = toTitleCase(dbUser.companyName ?? '')
  const transitTimeInfo = 'N/A'
  const origin = locations[0].name
  const destination = locations[locations.length - 1].name
  const targetCurrency = 'USD'
  const targetCurrencyData = getTargetCurrencySeaFclDataTableData(
    data,
    targetCurrency
  )
  return (
    <ConfirmedQuoteCard
      id={blok_id}
      userName={userName}
      userEmail={userEmail}
      userPhone={userPhone}
      userCompany={userCompany}
      transitInfo={transitTimeInfo}
      origin={origin}
      destination={destination}
      containerType={container_types.join(', ')}
      tag={service_type.toUpperCase()}
      carrier={carrier.toUpperCase()}
      total={total_cost.total_cost.usd.total}
      currency={targetCurrency}
    >
      <OfferSeaFclDataTable
        data={targetCurrencyData}
        grandTotal={total_cost.total_cost.usd.total}
        currency={targetCurrency}
        containerLabels={{
          d2: container_types.includes('20STD') ? '20STD' : null,
          d4: container_types.includes('40STD') ? '40STD' : null,
          d5: container_types.includes('40HC') ? '40HC' : null,
        }}
      />
    </ConfirmedQuoteCard>
  )
}
