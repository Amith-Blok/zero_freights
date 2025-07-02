import { createConfirmedQuote } from '@/data/confirmed-quote'
import { sendQuoteInfoToZeroFreight } from '@/lib/mail'
import { OfferZodSchema } from '@/schema/models/offer'
import { NextRequest, NextResponse } from 'next/server'
import { getTableFromSeaFcl } from './helper'
import { LabeledCost } from '@/models/offer/shared-types'
import { getOfferById } from '@/data/offer/offer'

export async function POST(request: NextRequest) {
  try {
    const { line_name, container_type, offer_id } = await request.json()
    // console.log({ line_name, contianer_type, offer_id })

    const unsafeOffers = await getOfferById(offer_id)
    const safeParseOffer = OfferZodSchema.safeParse(unsafeOffers)
    if (safeParseOffer.error) {
      console.log('validation faild ')
      console.log({ error: safeParseOffer.error })
      return NextResponse.json({ error: 'validation failded' }, { status: 400 })
    }
    const {
      user,
      bill_to,
      form_id,
      locations,
      offers,
      place_of_supply,
      subject,
      start_code,
      end_code,
      exchanges,
      tags,
      delivery_type,
      mode,
      created_at,
    } = safeParseOffer.data

    let confirmedQuote = [] as LabeledCost[]
    let packageLabel = ''
    let carrierName = ''
    let tranist = 40

    if (mode == 'SEA_FCL') {
      console.log({ line_name, container_type, offer_id })
      if (!line_name || !container_type || !offer_id) {
        console.log('invalid request')
        return NextResponse.json({ error: 'invalid request' }, { status: 400 })
      }
      const { data, containerLabel, lineName, tranistTime } =
        getTableFromSeaFcl({ offers, line_name, container_type })
      confirmedQuote = data
      packageLabel = containerLabel
      carrierName = lineName
      tranist = tranistTime
    } else if (mode == 'WAR') {
      const { carrier, package_type, estimated_days } = safeParseOffer.data
      confirmedQuote = offers
      packageLabel = package_type
      carrierName = carrier
      tranist = estimated_days
    } else if (mode == 'LAND') {
      const { carrier, package_type } = safeParseOffer.data
      confirmedQuote = offers
      packageLabel = package_type
      carrierName = carrier
      tranist = 0
    } else if (mode == 'AIR') {
      const { carrier, package_type } = safeParseOffer.data
      confirmedQuote = offers
      packageLabel = package_type
      carrierName = carrier
      tranist = 0
    } else {
      return NextResponse.json({ error: 'invalid request' }, { status: 400 })
    }

    const { total_inr, total_usd } = confirmedQuote.reduce(
      (acc, line) => {
        const inr = acc.total_inr + line.inr
        const usd = acc.total_usd + line.usd
        return { total_inr: inr, total_usd: usd }
      },
      { total_inr: 0, total_usd: 0 }
    )

    const confirmed_quote_id = await createConfirmedQuote({
      form_id,
      offer_id,
      offer_date: created_at?.toISOString() ?? '',
      user,
      delivery_type,
      locations,
      tags,
      exchanges,
      carrier: carrierName,
      transit_time: tranist,
      total_cost: { inr: total_inr, usd: total_usd },
      data: confirmedQuote,
      container_type: packageLabel,
      start_code,
      end_code,
      subject,
      bill_to,
      place_of_supply,
    })

    if (!confirmed_quote_id) {
      return NextResponse.json(
        { message: 'couldnt create confirmed quote' },
        { status: 404 }
      )
    }

    await sendQuoteInfoToZeroFreight({
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userCompany: user.company,
      subject,
      tag: tags[0],
      containerType: packageLabel,
      total: total_inr,
      detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${confirmed_quote_id}`,
      destination: locations.at(-1)?.name || 'N/A',
      origin: locations[0].name,
      transitInfo: `Est. ${tranist} days port to port`,
      carrier: carrierName.toUpperCase(),
    })

    return NextResponse.json({ confirmed_quote_id }, { status: 200 })
  } catch (error) {
    console.log({ error })

    return NextResponse.json(
      { message: 'something wenth wrong', error },
      { status: 404 }
    )
  }
}
