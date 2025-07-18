import { SeaFormSchema } from '@/schema/sea-schema'
import { NextRequest, NextResponse } from 'next/server'
import { getLCLSeaFreightCostByCode } from '@/data/lcl-sea-freight'
import {
  inLtlTruckingCost,
  newUsLtlTruckingCost,
} from '@/app/api/form/helper/trucking'
import { getGoogleLocationByPlaceId } from '@/app/api/form/helper/google-map'
import { generateQuoteMetaDetails, generateOfferId } from '../helper/lib'

import { INR_TO_USD, USD_TO_INR } from '@/constants'
import { newAppendAdditionalFees } from '../helper/table-data-appender'
import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import { createForm } from '@/data/form'
import { exchangeValues } from '@/lib/exchange'
import { Location, ServiceType } from '@/models/offer/shared-types'
import { createSeaLclOffer } from '@/data/offer/sea-lcl-offer'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the incoming request data
    const data = await request.json()
    const validateData = SeaFormSchema.safeParse(data)
    if (!validateData.success) {
      return NextResponse.json({ error: 'invalid data' }, { status: 400 })
    }

    // Ensure the mode is LCL (Less than Container Load)
    const { modes } = validateData.data
    if (modes != 'LCL') {
      return NextResponse.json(
        { error: 'this route is for sea fcl' },
        { status: 400 }
      )
    }

    // Destructure necessary fields from validated data
    const {
      pickup_check,
      pickup_location,
      ori_country,
      ori_port_rail,
      ori_port_if_rail,
      des_country,
      delivery_check,
      delivery_location,
      des_port_rail,
      des_port_if_rail,
      lcl_cbm_ton,
      icoterms,
      user_name,
      company_name,
      email,
      phone,
    } = validateData.data

    // Initialize cost objects for various charges
    const seaLclFreight = {
      label: 'LCL Sea Freight',
      currency: 'USD',
      usd: 0,
      inr: 0,
    }
    const terminalCharge = {
      label: 'Terminal Charge',
      currency: 'INR',
      usd: 0,
      inr: 0,
    }
    const docCharge = {
      label: 'DOC Charge',
      currency: 'INR',
      usd: 0,
      inr: 0,
    }
    const vgmCharge = {
      label: 'VGM Charge',
      currency: 'USD',
      usd: 0,
      inr: 0,
    }
    const ddcCharge = {
      label: 'DDC Charge',
      currency: 'USD',
      usd: 0,
      inr: 0,
    }
    const loadUnLoadFee = {
      label: 'Load Unload Fee',
      currency: 'USD',
      usd: 0,
      inr: 0,
    }
    const chasisFee = {
      label: 'Chasis Fee',
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

    // Fetch sea freight cost from the database
    const seaFreightCostDB = await getLCLSeaFreightCostByCode(
      des_port_rail.port_code
    ).catch((error) => {
      console.log({ error, location: 'api/form/sea-lcl' })
    })
    if (!seaFreightCostDB) {
      return NextResponse.json(
        {
          error:
            "Couldn't find lcl sea freight cost try agains with new form data",
        },
        { status: 500 }
      )
    }

    // Calculate weights and charges
    let { cbm, ton, kg } = lcl_cbm_ton
    let lbsPerHundred = (ton * 2204.62) / 100

    loadUnLoadFee.usd = Math.min(Math.max(97, lbsPerHundred * 5.02), 450)
    loadUnLoadFee.inr = loadUnLoadFee.usd * USD_TO_INR
    tags.push(`${cbm.toFixed(2)} CBM`)
    tags.push(`${ton.toFixed(2)} TON`)

    seaLclFreight.usd = seaFreightCostDB * cbm
    seaLclFreight.inr = seaLclFreight.usd * USD_TO_INR

    terminalCharge.inr = Math.max(
      1250 * Math.max(2, cbm),
      1750 * Math.max(2, ton)
    )
    terminalCharge.usd = terminalCharge.inr * INR_TO_USD

    docCharge.inr = 4250
    docCharge.usd = docCharge.inr * INR_TO_USD

    vgmCharge.usd = 20 * cbm
    vgmCharge.inr = vgmCharge.usd * USD_TO_INR

    ddcCharge.usd = Math.max(50, 28.1 * cbm)
    ddcCharge.inr = ddcCharge.usd * USD_TO_INR

    chasisFee.usd = Math.max(15, Math.max(5 * cbm, 5 * ton))
    chasisFee.inr = chasisFee.usd * USD_TO_INR

    // Calculate pickup and delivery LTL costs based on origin country
    if (ori_country == 'IN') {
      // Handle trucking costs for India as origin

      if (pickup_check && pickup_location) {
        // Calculate pickup cost from India to sea port
        const { lat: pickupLocationLat, lng: pickupLocationLng } =
          await getGoogleLocationByPlaceId(pickup_location.place_id)
        pickupLTL.inr = await inLtlTruckingCost({
          start_latitude: pickupLocationLat,
          start_longitude: pickupLocationLng,
          end_latitude: ori_port_rail.lat,
          end_longitude: ori_port_rail.lng,
          ton,
          cbm,
        })
        pickupLTL.usd = pickupLTL.inr * INR_TO_USD
      }

      // Calculate delivery cost for USA or other countries
      if (delivery_check && delivery_location) {
        const { lat: deliveryLocationLat, lng: deliveryLocationLng } =
          await getGoogleLocationByPlaceId(delivery_location.place_id)
        const usLtl = await newUsLtlTruckingCost({
          start_latitude: des_port_rail.lat,
          start_longitude: des_port_rail.lng,
          end_latitude: deliveryLocationLat,
          end_longitude: deliveryLocationLng,
          weight: kg,
          unit: 'KG',
          cbm,
        })
        destinationLTL.usd = usLtl ?? 0
        destinationLTL.inr = destinationLTL.usd * USD_TO_INR
      }
    } else {
      // Handle trucking costs for USA or other countries as origin
      if (pickup_check && pickup_location) {
        const { lat: pickupLocationLat, lng: pickupLocationLng } =
          await getGoogleLocationByPlaceId(pickup_location.place_id)
        pickupLTL.usd = await newUsLtlTruckingCost({
          start_latitude: pickupLocationLat,
          start_longitude: pickupLocationLng,
          end_latitude: ori_port_rail.lat,
          end_longitude: ori_port_rail.lng,
          weight: kg,
          unit: 'KG',
          cbm,
        })
        pickupLTL.inr = pickupLTL.usd * INR_TO_USD
      }

      // Calculate destination cost for India
      if (delivery_check && delivery_location) {
        const { lat: deliveryLocationLat, lng: deliveryLocationLng } =
          await getGoogleLocationByPlaceId(delivery_location.place_id)
        destinationLTL.inr = await inLtlTruckingCost({
          start_latitude: des_port_rail.lat,
          start_longitude: des_port_rail.lng,
          end_latitude: deliveryLocationLat,
          end_longitude: deliveryLocationLng,
          ton,
          cbm,
        })
        destinationLTL.usd = destinationLTL.inr * INR_TO_USD
      }
    }

    // Compile all charges into a quote table
    const quoteTableData = [
      seaLclFreight,
      pickupLTL,
      terminalCharge,
      docCharge,
      vgmCharge,
      ddcCharge,
      chasisFee,
      loadUnLoadFee,
      destinationLTL,
    ]

    // Add clearance fee if the origin is India
    if (ori_country == 'IN') {
      quoteTableData.splice(3, 0, CLEARANCE_FEE_OBJ)
    }

    // Append any additional fees to the quote table
    newAppendAdditionalFees(quoteTableData)

    // Calculate total costs in INR and USD
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

    // Build a list of locations involved in the shipment
    let locations: Location[] = []
    if (pickup_check && pickup_location)
      locations.push({
        name: pickup_location.description,
        code: ori_country,
        type: 'door',
      })
    if (ori_port_rail)
      locations.push({
        name: ori_port_rail.port_name,
        code: ori_port_rail.port_code,
        type:
          ori_country === 'IN'
            ? ori_port_rail.type == 'PORT'
              ? 'port'
              : 'rail'
            : 'port',
      })
    if (ori_port_if_rail && ori_country === 'IN') {
      locations.push({
        name: ori_port_if_rail.port_name,
        code: ori_port_if_rail.port_code,
        type: 'port',
      })
    }
    if (des_port_if_rail && des_country === 'IN') {
      locations.push({
        name: des_port_if_rail.port_name,
        code: des_port_if_rail.port_code,
        type: 'port',
      })
    }
    if (des_port_rail) {
      locations.push({
        name: des_port_rail.port_name,
        code: des_port_rail.port_code,
        type:
          des_country === 'IN'
            ? des_port_rail.type == 'PORT'
              ? 'port'
              : 'rail'
            : 'port',
      })
    }
    if (delivery_check && delivery_location)
      locations.push({
        name: delivery_location.description,
        code: des_country,
        type: 'door',
      })

    // Generate quote details for the shipment
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        pickup_location: pickup_location ?? { description: '' },
        ori_port_rail,
        des_port_rail,
        delivery_location: delivery_location ?? { description: '' },
        firstSlug: `SEA LCL ${cbm.toFixed(2)} CBM ${ton.toFixed(2)} TON`,
        icoterms,
      })

    // Create a form entry for the validated data
    const formId = await createForm(validateData)

    // Generate a unique quote ID and prepare user details
    const blok_quote_id = await generateOfferId()
    const user = {
      id: 'BLOK_UNKNOW_USER',
      name: toTitleCase(user_name) || '',
      email: email || '',
      company: toTitleCase(company_name) || '',
      phone: phone ? formatPhoneNumber(phone) : '',
    }

    // Create a sea LCL offer with all the gathered information
    const offer_id = await createSeaLclOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: pickup_check
        ? pickup_location?.place_id || ''
        : ori_port_rail.port_name,
      end_code: delivery_check
        ? delivery_location?.place_id || ''
        : des_port_rail.port_name,
      mode: 'SEA_LCL',
      service_type: ServiceType.SEA_LCL,
      package_type: `${cbm.toFixed(2)} CBM`,
      carrier: 'Hapag',
      total_cost: { inr: totalInrCost, usd: totalUsdCost },
      pointDetination: pointDetination,
      tags,
      locations: locations,
      exchanges: exchangeValues(),
      offers: quoteTableData,
    })

    // Return the offer ID and quote table data as a JSON response
    return NextResponse.json({ offer_id, quoteTableData }, { status: 200 })
  } catch (error) {
    // Log and return any errors encountered during processing
    console.log(error)
    return NextResponse.json(
      {
        error: 'exception error sea lcl route:',
        details: error,
      },
      { status: 500 }
    )
  }
}
