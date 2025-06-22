import { airFreightByStartEndCode } from '@/data/air-freight'
import { AirFormSchema } from '@/schema/air-schema'
import { NextRequest, NextResponse } from 'next/server'
import { getCheapestAirLineRecord } from '../helper/airline'
import { inLtlTruckingCost, usLtlTruckingCost } from '../helper/trucking'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import {
  generateQuoteMetaDetails,
  generateQuoteTableData,
  randomIdGenerator,
} from '../helper/lib'
import { appendAdditionalFees } from '../helper/table-data-appender'
import { sendQuoteInfoToTeam } from '@/lib/mail'
import { createQuote } from '@/data/quotes'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validateData = AirFormSchema.safeParse(data)
    if (!validateData.success) {
      return NextResponse.json({ error: 'invalid data' }, { status: 400 })
    }
    const {
      ori_airport,
      des_airport,
      ori_country,
      air_cbm_ton,
      pickup_check,
      pickup_location,
      delivery_check,
      delivery_location,
      icoterms,
      user_name,
      company_name,
      email,
      phone,
    } = validateData.data
    const { ton, cbm, kg } = air_cbm_ton

    const terminalCost = {
      name: 'Terminal Cost',
      code: 'TERMINAL_COST',
      currency: 'USD',
      value: 375,
    }
    const ams = {
      name: 'AMS Cost',
      code: 'AMS',
      currency: 'USD',
      value: 20,
    }

    const awb = {
      name: 'AWB Cost',
      code: 'AWB',
      currency: 'USD',
      value: 15,
    }

    const airFreight = {
      name: 'Air Freight',
      code: 'BLOK_AIR_FREIGHT',
      currency: 'USD',
      value: 0,
    }
    const pickupLTL = {
      name: 'Pickup LTL',
      code: 'PICKUP_LTL',
      currency: ori_country == 'IN' ? 'INR' : 'USD',
      value: 0,
    }
    const destinationLTL = {
      name: 'Destination LTL',
      code: 'DESTINATION_LTL',
      currency: ori_country == 'IN' ? 'USD' : 'INR',
      value: 0,
    }
    //AIR Freight
    const startCode = ori_airport.port_code
    const endCode = des_airport.port_code

    const airlines = await airFreightByStartEndCode({ startCode, endCode })
    if (!airlines) {
      return NextResponse.json(
        {
          error: "Couldn't find air freight cost try agains with new form data",
        },
        { status: 500 }
      )
    }
    const cheapestAirlineRecord = getCheapestAirLineRecord(airlines.airlines)
    airFreight.value = cheapestAirlineRecord.cost * kg
    airFreight.name = `Air Freight:${cheapestAirlineRecord.airline_name}(${cheapestAirlineRecord.cost}$/kg)`

    //pickupLTL and deliveryLTL
    if (ori_country == 'IN') {
      //pickup INDIA country trucking
      if (pickup_check && pickup_location) {
        const { lat: pickupLocationLat, lng: pickupLocationLng } =
          await getGoogleLocationByPlaceId(pickup_location.place_id)
        pickupLTL.value = await inLtlTruckingCost({
          start_latitude: ori_airport.lat,
          start_longitude: ori_airport.lng,
          end_latitude: pickupLocationLat,
          end_longitude: pickupLocationLng,
          ton,
          cbm,
        })
      }

      //delivery USA or other country trucking
      if (delivery_check && delivery_location) {
        destinationLTL.value =
          (await usLtlTruckingCost({
            airportCode: des_airport.port_code,
            zipcode: delivery_location.zipcode || '',
            kg,
          })) ?? 0
      }
    } else {
      //pickup us or other country trucking
      if (pickup_check && pickup_location) {
        pickupLTL.value =
          (await usLtlTruckingCost({
            airportCode: ori_airport.port_code,
            zipcode: pickup_location.zipcode || '',
            kg,
          })) ?? 0
      }

      //destionation  india country trucking
      if (delivery_check && delivery_location) {
        const { lat: deliveryLocationLat, lng: deliveryLocationLng } =
          await getGoogleLocationByPlaceId(delivery_location.place_id)
        destinationLTL.value = await inLtlTruckingCost({
          start_latitude: des_airport.lat,
          start_longitude: des_airport.lng,
          end_latitude: deliveryLocationLat,
          end_longitude: deliveryLocationLng,
          ton,
          cbm,
        })
      }
    }
    const quoteTableData = generateQuoteTableData([
      airFreight,
      pickupLTL,
      destinationLTL,
      terminalCost,
      ams,
      awb,
    ])

    //COMMENT: appended additional fees
    appendAdditionalFees(quoteTableData)

    const totalSum = quoteTableData.reduce(
      (acc, item) => {
        return {
          totalInrCost: acc.totalInrCost + item.total_amount,
          totalUsdCost: acc.totalUsdCost + item.cost_usd,
          subtotalInrCost: acc.subtotalInrCost + item.cost_inr,
          gstFiveInrTotal:
            item.gst_percentage == 5
              ? acc.gstFiveInrTotal + item.gst_amount
              : acc.gstFiveInrTotal,
          gstEighteenInrTotal:
            item.gst_percentage == 18
              ? acc.gstEighteenInrTotal + item.gst_amount
              : acc.gstEighteenInrTotal,
        }
      },
      {
        totalInrCost: 0,
        totalUsdCost: 0,
        subtotalInrCost: 0,
        gstFiveInrTotal: 0,
        gstEighteenInrTotal: 0,
      } // Initial values
    )

    //quote details
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        pickup_location,
        ori_port_rail: ori_airport,
        des_port_rail: des_airport,
        delivery_location,
        firstSlug: `AIR ${cbm.toFixed(2)} CBM ${ton.toFixed(2)} TON`,
        icoterms,
        shipline: cheapestAirlineRecord.airline_code,
      })
    //send email

    const quote_id = await createQuote({
      blok_quote_id: randomIdGenerator(),
      user_id: email,
      user_name,
      subject,
      quote_date: new Date(),
      user_company: company_name,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      total_inr: totalSum.totalInrCost,
      sub_total_inr_cost: totalSum.subtotalInrCost,
      gst_eighteen_inr_cost: totalSum.gstEighteenInrTotal,
      gst_five_inr_cost: totalSum.gstFiveInrTotal,
      total_usd: totalSum.totalUsdCost,
      line: 'All',
      line_quotation_number: '#' + new Date().getTime(),
      estimated_day: 0,
      valid_from: new Date().toLocaleDateString('en-CA'),
      valid_to: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString('en-CA'),
      routing: [],
      form_data: validateData.data,
      data: quoteTableData,
    })
    await sendQuoteInfoToTeam({
      user_name,
      subject,
      total: totalSum.totalInrCost,
      quoteLink: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.quote.bloksupplychain.com'}/quote/${quote_id}`,
      company_name,
      phone_number: phone,
      email,
    })
    return NextResponse.json(
      {
        quote_id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error: 'exception error air route:',
        details: error,
      },
      { status: 500 }
    )
  }
}
