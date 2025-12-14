import { OfferZodSchema } from '@/schema/models/offer'
import { NextRequest, NextResponse } from 'next/server'
import { getOfferById } from '@/data/offer/offer'
import { getUserById } from '@/data/user'
import {
  generateConfirmedQuoteAir,
  generateConfirmedQuoteLand,
  generateConfirmedQuoteSeaDg,
  generateConfirmedQuoteSeaFcl,
  generateConfirmedQuoteSeaIg,
  generateConfirmedQuoteSeaLcl,
  generateConfirmedQuoteSeaOog,
  generateConfirmedQuoteSeaRf,
  generateConfirmedQuoteWarehouse,
} from './helper'
import { getConfirmedQuoteByBlokIdAndUserId } from '@/data/confirmed-quotes/confirmed-quotes'

export async function POST(request: NextRequest) {
  try {
    const { line_name, container_type: _c, offer_id } = await request.json()
    // console.log({ line_name, contianer_type, offer_id })

    const unsafeOffers = await getOfferById(offer_id)
    const safeParseOffer = OfferZodSchema.safeParse(unsafeOffers)
    if (safeParseOffer.error) {
      console.log('validation faild ')
      console.log({ error: safeParseOffer.error })
      return NextResponse.json({ error: 'validation failded' }, { status: 400 })
    }
    const { user_id, mode, blok_id: offer_blok_id } = safeParseOffer.data

    const dbUser = await getUserById(user_id)
    if (
      !dbUser?.name ||
      !dbUser?.email ||
      !dbUser?.phone ||
      !dbUser?.companyName
    ) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 })
    }

    const ExistingConfirmedQuote = await getConfirmedQuoteByBlokIdAndUserId({
      offerId: offer_blok_id,
      userId: dbUser.id,
    }).catch((error) => {
      console.log({ error })
      return null
    })
    if (ExistingConfirmedQuote) {
      //NOTE: remove it after its done
      // console.log('confirmed quote already exists')
      // console.log({ ExistingConfirmedQuote })
      // return NextResponse.json(
      //   { confirmed_quote_id: ExistingConfirmedQuote },
      //   { status: 200 }
      // )
    }
    let confirmedQuoteId
    switch (mode) {
      case 'WAR': {
        confirmedQuoteId = await generateConfirmedQuoteWarehouse({
          ...safeParseOffer.data,
          user: dbUser,
        })
        break
      }
      case 'AIR': {
        confirmedQuoteId = await generateConfirmedQuoteAir({
          ...safeParseOffer.data,
          user: dbUser,
        })
        break
      }
      case 'LAND': {
        confirmedQuoteId = await generateConfirmedQuoteLand({
          ...safeParseOffer.data,
          user: dbUser,
        })
        break
      }
      case 'SEA_LCL': {
        confirmedQuoteId = await generateConfirmedQuoteSeaLcl({
          ...safeParseOffer.data,
          user: dbUser,
        })
        break
      }
      case 'SEA_FCL': {
        confirmedQuoteId = await generateConfirmedQuoteSeaFcl({
          ...safeParseOffer.data,
          user: dbUser,
          lineName: line_name,
        })
        break
      }
      case 'SEA_DG': {
        confirmedQuoteId = await generateConfirmedQuoteSeaDg({
          ...safeParseOffer.data,
          user: dbUser,
          lineName: line_name,
        })
        break
      }
      case 'SEA_RF': {
        confirmedQuoteId = await generateConfirmedQuoteSeaRf({
          ...safeParseOffer.data,
          user: dbUser,
          lineName: line_name,
        })
        break
      }
      case 'SEA_IG': {
        confirmedQuoteId = await generateConfirmedQuoteSeaIg({
          ...safeParseOffer.data,
          user: dbUser,
          lineName: line_name,
        })
        break
      }
      case 'SEA_OOG': {
        confirmedQuoteId = await generateConfirmedQuoteSeaOog({
          ...safeParseOffer.data,
          user: dbUser,
          lineName: line_name,
        })
        break
      }
      default:
        return NextResponse.json({ error: 'invalid request' }, { status: 400 })
    }

    return NextResponse.json(
      {
        confirmed_quote_id: confirmedQuoteId,
        message: 'confirmed quote generated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.log({ error })

    return NextResponse.json(
      {
        message: 'something wenth wrong while generating confirmed quote',
        error,
      },
      { status: 404 }
    )
  }
}
