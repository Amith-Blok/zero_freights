import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import React from 'react'
import { ConfirmedQuoteCard } from '../confirmed-quote-card'
import { getUserById } from '@/data/user'
import { notFound } from 'next/navigation'
import { ConfirmedQuote } from '@/schema/models/confirmed-quote-new-zod'
import { OfferDataTable } from '@/components/data-table/offer-data-table'

export default async function WarehouseConfirmedQuotes(params: ConfirmedQuote) {
  const { mode } = params
  if (mode !== 'CONFIRMED_WAR') return notFound()
  const {
    blok_id,
    user_id,
    locations,
    carrier,
    service_type,
    transit_days,
    data,
    package_type,
    total_cost,
  } = params
  const dbUser = await getUserById(user_id)
  if (!dbUser) return notFound()
  const userName = toTitleCase(dbUser.name ?? '')
  const userEmail = dbUser.email ?? ''
  const userPhone = formatPhoneNumber(dbUser.phone ?? '')
  const userCompany = toTitleCase(dbUser.companyName ?? '')
  const transitTime = transit_days
  const transitTimeInfo = transitTime
    ? `Est. ${transitTime} days port to port`
    : 'N/A'
  const origin = locations[0].name
  const destination = locations[locations.length - 1].name
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
      containerType={package_type}
      tag={service_type.toUpperCase()}
      carrier={carrier.toUpperCase()}
      total={total_cost.usd}
      currency="USD"
    >
      <OfferDataTable
        data={data}
        containerType={package_type}
        grandTotal={total_cost.usd}
        currency="USD"
      />
    </ConfirmedQuoteCard>
  )
}
