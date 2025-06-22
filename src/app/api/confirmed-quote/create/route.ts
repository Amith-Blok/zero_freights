import { createConfirmedQuote } from '@/data/confirmed-quote'
import { getOfferById } from '@/data/offer'
import { convertDToStdContainer } from '@/lib/container'
import { currencyConverter } from '@/lib/exchange'
import { sendQuoteInfoToZeroFreight } from '@/lib/mail'
import { fclContainerToDContainer, formatPhoneNumber, toTitleCase } from '@/lib/utils'
import { LocationZodSchema, OfferZodSchema } from '@/schema/models/offer-zod'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { line_name, contianer_type, offer_id } = await request.json()
    // console.log({ line_name, contianer_type, offer_id })
    if (!line_name || !contianer_type || !offer_id) {
      return NextResponse.json({ error: 'invalid request' }, { status: 400 })
    }
    const unsafeOffers = await getOfferById(offer_id)
    const safeParseOffer = OfferZodSchema.safeParse(unsafeOffers)
    if (safeParseOffer.error) {
      console.log('validation faild ')
      console.log({ error: safeParseOffer.error })
      return NextResponse.json({ error: 'validation failded' }, { status: 400 })
    }
    const {
      user_name,
      user_email,
      user_id,
      user_company,
      user_phone,
      bill_to,
      form_id,
      locations,
      offers,
      place_of_supply,
      subject,
      start_code,
      end_code,
      exchanges,
      tag,
      delivery_type,
      created_at,
      container_type,
    } = safeParseOffer.data

    const linesFreightRates = offers.sea_freights

    const containerType = fclContainerToDContainer(
      container_type
    ).toLowerCase() as 'd2' | 'd4' | 'd5'
    const containerLabel = convertDToStdContainer(containerType)

    console.log({ container_type })
    console.log({ containerType })
    console.log({ containerLabel })

    const userSelectedLinesFreightRates = linesFreightRates.find(
      (line) => line.line_name == line_name.toLowerCase()
    )

    if (!userSelectedLinesFreightRates) {
      return NextResponse.json(
        { error: 'invalid request cant find line_name' },
        { status: 400 }
      )
    }

    const lineCharge = userSelectedLinesFreightRates.data.map((rate) => ({
      label: rate.label,
      inr: currencyConverter({
        cost: rate[containerType],
        sourceCurrency: rate.currency as any,
        targetCurrency: 'INR',
      }),
      usd: currencyConverter({
        cost: rate[containerType],
        sourceCurrency: rate.currency as any,
        targetCurrency: 'USD',
      }),
    }))
    const localsRates = offers.local_charges

    const filteredLocalCharges = localsRates.map((rate) => ({
      label: rate.label,
      inr: currencyConverter({
        cost: rate[containerType],
        sourceCurrency: rate.currency as any,
        targetCurrency: 'INR',
      }),
      usd: currencyConverter({
        cost: rate[containerType],
        sourceCurrency: rate.currency as any,
        targetCurrency: 'USD',
      }),
    }))

    const user = {
      user_id: user_id ?? 'UNKOWN',
      user_name: toTitleCase( user_name )|| '',
      user_email: user_email || '',
      user_company: toTitleCase(user_company) || '',
      user_phone: user_phone?formatPhoneNumber(user_phone) :'',
    }

    const confirmed_quote = [...lineCharge, ...filteredLocalCharges]
    const { total_inr, total_usd } = confirmed_quote.reduce(
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
      offer_date: new Date(created_at),
      user,
      delivery_type,
      locations,
      tag,
      exchanges,
      carrier: userSelectedLinesFreightRates.line_name,
      transit_time: userSelectedLinesFreightRates.port_to_days,
      total_cost: { inr: total_inr, usd: total_usd },
      confirmed_quote,
      container_type: containerLabel,
      created_at: new Date(),
      start_code,
      end_code,
      subject,
      bill_to,
      place_of_supply,
    })

    if(!confirmed_quote_id){
 return NextResponse.json(
      { message: 'couldnt create confirmed quote'  },
      { status: 404 }
    )
    }

    await sendQuoteInfoToZeroFreight(
      {
        userName:user.user_name,
        userEmail:user.user_email,
        userPhone:user.user_phone,
        userCompany:user.user_company,
        subject,
        tag,
        containerType:containerLabel,
        total:total_inr,
        detailPageUrl:`${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${confirmed_quote_id}`,
        destination:locations.at(-1)?.name||"N/A",
        origin:locations[0].name,
        transitInfo:`Est. ${userSelectedLinesFreightRates.port_to_days} days port to port`,
        carrier:userSelectedLinesFreightRates.line_name.toUpperCase(),
      }
    )


    return NextResponse.json({ confirmed_quote_id }, { status: 200 })
  } catch (error) {
    console.log({ error })

    return NextResponse.json(
      { message: 'something wenth wrong', error },
      { status: 404 }
    )
  }
}
