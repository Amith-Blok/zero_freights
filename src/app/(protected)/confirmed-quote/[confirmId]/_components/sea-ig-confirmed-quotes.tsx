import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import React from 'react'
import { ConfirmedQuoteCard } from '../confirmed-quote-card'
import { getUserById } from '@/data/user'
import { notFound } from 'next/navigation'
import { ConfirmedQuote } from '@/schema/models/confirmed-quote-new-zod'
import { getTargetCurrencyGaugeDataTableData } from '@/lib/sea-gauge-filter-utils'
import { OfferSeaGaugeDataTable } from '@/components/data-table/offer-sea-gauge-data-table'

export default async function SeaIgConfirmedQuotes(params: ConfirmedQuote) {
  const { mode } = params
  if (mode !== 'CONFIRMED_SEA_IG') return notFound()
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
  const targetCurrencyData = getTargetCurrencyGaugeDataTableData(
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
      <OfferSeaGaugeDataTable
        data={targetCurrencyData}
        grandTotal={total_cost.total_cost.usd.total}
        currency={targetCurrency}
        containerLabels={{
          ot2: container_types.includes('OT20') ? 'OT20' : null,
          ot4: container_types.includes('OT40') ? 'OT40' : null,
          fr2: container_types.includes('FR20') ? 'FR20' : null,
          fr4: container_types.includes('FR40') ? 'FR40' : null,
          fr5: container_types.includes('FR45') ? 'FR45' : null,
        }}
      />
    </ConfirmedQuoteCard>
  )
}
