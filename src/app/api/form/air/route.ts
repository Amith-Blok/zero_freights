import { airFreightByStartEndCode } from '@/data/air-freight'
import { AirFormSchema } from '@/schema/air-schema'
import { NextRequest, NextResponse } from 'next/server'
import { getCheapestAirLineRecord } from '../helper/airline'
import { inLtlTruckingCost, newUsLtlTruckingCost } from '../helper/trucking'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { generateQuoteMetaDetails, generateOfferId } from '../helper/lib'
import { USD_TO_INR } from '@/constants'
import { INR_TO_USD } from '@/constants/exchange-value'
import { newAppendAdditionalFees } from '../helper/table-data-appender'
import { exchangeValues } from '@/lib/exchange'
import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import { createForm } from '@/data/form'
import { Location, ServiceType } from '@/models/offer/shared-types'
import { createAirOffer } from '@/data/offer/air'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'

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
      des_country,
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
      label: 'Terminal Cost',
      currency: 'USD',
      usd: 0,
      inr: 0,
    }
    const ams = {
      label: 'AMS Cost',
      currency: 'USD',
      usd: 20,
      inr: 20 * USD_TO_INR,
    }

    const awb = {
      label: 'AWB Cost',
      currency: 'USD',
      usd: 15,
      inr: 15 * USD_TO_INR,
    }

    const airFreight = {
      label: 'Air Freight',
      currency: 'USD',
      usd: 0,
      inr: 0,
    }
    const pickupLTL = {
      label: 'Pickup LTL',
      currency: ori_country == 'IN' ? 'INR' : 'USD',
      usd: 0,
      inr: 0,
    }
    const destinationLTL = {
      label: 'Destination LTL',
      currency: ori_country == 'IN' ? 'USD' : 'INR',
      usd: 0,
      inr: 0,
    }
    let tags: string[] = []
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
    airFreight.usd = cheapestAirlineRecord.cost * kg
    airFreight.inr = airFreight.usd * USD_TO_INR
    airFreight.label = `Air Freight:${cheapestAirlineRecord.airline_name}(${cheapestAirlineRecord.cost}$/kg)`
    tags.push(`${cbm.toFixed(2)} CBM `)
    tags.push(`${ton.toFixed(2)} TON `)
    //pickupLTL and deliveryLTL
    if (ori_country == 'IN') {
      // pickup from india pickup location --> india airport
      if (pickup_check && pickup_location) {
        const { lat: pickupLocationLat, lng: pickupLocationLng } =
          await getGoogleLocationByPlaceId(pickup_location.place_id)

        pickupLTL.inr = await inLtlTruckingCost({
          start_latitude: pickupLocationLat,
          start_longitude: pickupLocationLng,
          end_latitude: ori_airport.lat,
          end_longitude: ori_airport.lng,
          ton,
          cbm,
        })
        pickupLTL.usd = pickupLTL.inr * INR_TO_USD
      }
      //delivery USA or other country trucking
      if (delivery_check && delivery_location) {
        const { lat: deliveryLocationLat, lng: deliveryLocationLng } =
          await getGoogleLocationByPlaceId(delivery_location.place_id)
        //destinationLTL from USA airport --> USA delivery location
        destinationLTL.usd = await newUsLtlTruckingCost({
          start_latitude: des_airport.lat,
          start_longitude: des_airport.lng,
          end_latitude: deliveryLocationLat,
          end_longitude: deliveryLocationLng,
          cbm,
          weight: kg,
          unit: 'KG',
        })

        destinationLTL.inr = destinationLTL.usd * USD_TO_INR
      }
    }
    //Country is USA
    else {
      //pickup us or other country trucking
      if (pickup_check && pickup_location) {
        const { lat: pickupLocationLat, lng: pickupLocationLng } =
          await getGoogleLocationByPlaceId(pickup_location.place_id)
        // pickLTL from USA pickup location --> USA airport
        pickupLTL.usd = await newUsLtlTruckingCost({
          start_latitude: pickupLocationLat,
          start_longitude: pickupLocationLng,
          end_latitude: ori_airport.lat,
          end_longitude: ori_airport.lng,
          cbm,
          weight: kg,
          unit: 'KG',
        })
        pickupLTL.inr = pickupLTL.usd * USD_TO_INR
      }

      //destionation  india country trucking
      if (delivery_check && delivery_location) {
        const { lat: deliveryLocationLat, lng: deliveryLocationLng } =
          await getGoogleLocationByPlaceId(delivery_location.place_id)
        // destinationLTL from IND airport --> IND delivery location
        destinationLTL.inr = await inLtlTruckingCost({
          start_latitude: des_airport.lat,
          start_longitude: des_airport.lng,
          end_latitude: deliveryLocationLat,
          end_longitude: deliveryLocationLng,
          ton,
          cbm,
        })
        destinationLTL.usd = destinationLTL.inr * INR_TO_USD
      }
    }

    terminalCost.usd = Math.max(375, 0.2 * airFreight.usd)
    terminalCost.inr = terminalCost.usd * USD_TO_INR
    const quoteTableData = [airFreight, terminalCost, ams, awb]

    let locations: Location[] = [
      {
        name: ori_airport.port_name,
        code: ori_airport.port_code,
        type: 'air',
      },
      {
        name: des_airport.port_name,
        code: des_airport.port_code,
        type: 'air',
      },
    ]

    if (pickup_check && pickup_location) {
      locations.splice(0, 0, {
        name: pickup_location.description,
        code: ori_country,
        type: 'door',
      })
      quoteTableData.splice(1, 0, pickupLTL) // Insert at index 1
    }

    if (delivery_check && delivery_location) {
      locations.push({
        name: delivery_location.description,
        code: des_country,
        type: 'door',
      })
      // Insert at index 2 if pickupLTL was inserted, else at index 1
      const insertIndex = pickup_check && pickup_location ? 2 : 1
      quoteTableData.splice(insertIndex, 0, destinationLTL)
    }

    //COMMENT: added clearance fee if origin is india
    if (ori_country == 'IN') {
      quoteTableData.splice(2, 0, CLEARANCE_FEE_OBJ)
    }

    //COMMENT: appended additional fees
    newAppendAdditionalFees(quoteTableData, 'AIR')

    const { totalInrCost, totalUsdCost } = quoteTableData.reduce(
      (acc, item) => {
        return {
          totalInrCost: acc.totalInrCost + item.inr,
          totalUsdCost: acc.totalUsdCost + item.usd,
        }
      },
      {
        totalInrCost: 0,
        totalUsdCost: 0,
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

    //FormId
    const formId = await createForm(validateData)

    const blok_quote_id = await generateOfferId()
    const user = {
      id: 'BLOK_UNKNOW_USER',
      name: toTitleCase(user_name) || '',
      email: email || '',
      company: toTitleCase(company_name) || '',
      phone: phone ? formatPhoneNumber(phone) : '',
    }
    const offer_id = await createAirOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: ori_airport.port_code || '',
      end_code: des_airport.port_code || '',
      mode: 'AIR',
      service_type: ServiceType.AIR,
      package_type: `${cbm.toFixed(2)} CBM `,
      carrier: toTitleCase(cheapestAirlineRecord.airline_name ?? 'Air India'),
      total_cost: { inr: totalInrCost, usd: totalUsdCost },
      pointDetination: pointDetination,
      tags,
      locations: locations,
      exchanges: exchangeValues(),
      offers: quoteTableData,
    })

    return NextResponse.json(
      {
        offer_id,
        quoteTableData,
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
