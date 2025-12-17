import { airFreightByStartEndCode } from '@/data/air-freight'
import { AirFormSchema } from '@/schema/air-schema'
import { NextRequest, NextResponse } from 'next/server'
import { getCheapestAirLineRecord } from '../helper/airline'
import { inLtlTruckingCost, newUsLtlTruckingCost } from '../helper/trucking'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { generateQuoteMetaDetails, generateOfferId } from '../helper/lib'
import { USD_TO_INR } from '@/constants'
import { INR_TO_USD } from '@/constants/exchange-value'
import { appendAdditionFees } from '../helper/table-data-appender'
import { exchangeValues } from '@/lib/exchange'
import { createForm } from '@/data/form'
import { LabeledCost, ServiceType } from '@/models/offer/shared-types'
import { createAirOffer } from '@/data/offer/air'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'
import { getDutyByHsCodeCountry } from '@/data/duties'
import { OfferModeTypes, Location } from '@/models/offer/shared-types'
import { IncotermsType } from '@/schema/sea-schema'
import { getUser } from '@/lib/user'
import { toTitleCase } from '@/lib/utils'

// Helper to calculate pickup LTL
interface PickupLTLArgs {
  ori_country: string
  pickup_check: boolean
  pickup_location?: { description: string; place_id: string }
  ori_airport: Location & { lat: number; lng: number }
  ton: number
  cbm: number
  kg: number
}
async function calculatePickupLTL({
  ori_country,
  pickup_check,
  pickup_location,
  ori_airport,
  ton,
  cbm,
  kg,
}: PickupLTLArgs): Promise<LabeledCost | null> {
  if (!pickup_check || !pickup_location) return null
  if (ori_country === 'IN') {
    const { lat, lng } = await getGoogleLocationByPlaceId(
      pickup_location.place_id
    )
    const inr = await inLtlTruckingCost({
      start_latitude: lat,
      start_longitude: lng,
      end_latitude: ori_airport.lat,
      end_longitude: ori_airport.lng,
      ton,
      cbm,
    })
    return {
      label: 'Pickup LTL',
      inr,
      usd: inr * INR_TO_USD,
    }
  } else {
    const { lat, lng } = await getGoogleLocationByPlaceId(
      pickup_location.place_id
    )
    const usd = await newUsLtlTruckingCost({
      start_latitude: lat,
      start_longitude: lng,
      end_latitude: ori_airport.lat,
      end_longitude: ori_airport.lng,
      cbm,
      weight: kg,
      unit: 'KG',
    })
    return {
      label: 'Pickup LTL',
      inr: usd * USD_TO_INR,
      usd,
    }
  }
}

// Helper to calculate destination LTL
interface DestinationLTLArgs {
  ori_country: string
  delivery_check: boolean
  delivery_location?: { description: string; place_id: string }
  des_airport: Location & { lat: number; lng: number }
  ton: number
  cbm: number
  kg: number
}
async function calculateDestinationLTL({
  ori_country,
  delivery_check,
  delivery_location,
  des_airport,
  ton,
  cbm,
  kg,
}: DestinationLTLArgs): Promise<LabeledCost | null> {
  if (!delivery_check || !delivery_location) return null
  if (ori_country === 'IN') {
    const { lat, lng } = await getGoogleLocationByPlaceId(
      delivery_location.place_id
    )
    const usd = await newUsLtlTruckingCost({
      start_latitude: des_airport.lat,
      start_longitude: des_airport.lng,
      end_latitude: lat,
      end_longitude: lng,
      cbm,
      weight: kg,
      unit: 'KG',
    })
    return {
      label: 'Destination LTL',
      inr: usd * USD_TO_INR,
      usd,
    }
  } else {
    const { lat, lng } = await getGoogleLocationByPlaceId(
      delivery_location.place_id
    )
    const inr = await inLtlTruckingCost({
      start_latitude: des_airport.lat,
      start_longitude: des_airport.lng,
      end_latitude: lat,
      end_longitude: lng,
      ton,
      cbm,
    })
    return {
      label: 'Destination LTL',
      inr,
      usd: inr * INR_TO_USD,
    }
  }
}

// Helper to build tags
interface BuildTagsArgs {
  cbm: number
  ton: number
  incoterms: string
  hsn: { code: string }
  value: number
  duty?: number
}
function buildTags({
  cbm,
  ton,
  incoterms,
  hsn,
  value,
  duty,
}: BuildTagsArgs): string[] {
  const tags = [`${cbm.toFixed(2)} CBM `, `${ton.toFixed(2)} TON `, incoterms]
  tags.push(`HS: ${hsn.code}`)
  tags.push(`${value} USD`)
  if (typeof duty === 'number') {
    tags.push(`DUTY: ${duty.toFixed(2)}%`)
  } else {
    tags.push(`DUTY: N/A`)
  }
  return tags
}

// Helper to build locations
interface BuildLocationsArgs {
  pickup_check: boolean
  pickup_location?: { description: string; place_id: string }
  ori_country: string
  ori_airport: Location
  des_airport: Location
  delivery_check: boolean
  delivery_location?: { description: string; place_id: string }
  des_country: string
}
function buildLocations({
  pickup_check,
  pickup_location,
  ori_country,
  ori_airport,
  des_airport,
  delivery_check,
  delivery_location,
  des_country,
}: BuildLocationsArgs): Location[] {
  let locations: Location[] = [
    {
      name: (ori_airport as any).port_name || ori_airport.name,
      code: (ori_airport as any).port_code || ori_airport.code,
      type: 'air',
    },
    {
      name: (des_airport as any).port_name || des_airport.name,
      code: (des_airport as any).port_code || des_airport.code,
      type: 'air',
    },
  ]
  if (pickup_check && pickup_location) {
    locations.splice(0, 0, {
      name: pickup_location.description,
      code: ori_country,
      type: 'door',
    })
  }
  if (delivery_check && delivery_location) {
    locations.push({
      name: delivery_location.description,
      code: des_country,
      type: 'door',
    })
  }
  return locations
}

// Helper to get duty cost
interface GetDutyCostArgs {
  incoterms: string
  hsn: { code: string }
  des_country: string
  value: number
}
interface DutyCostType extends LabeledCost {
  percent: number
}
async function getDutyCost({
  incoterms,
  hsn,
  des_country,
  value,
}: GetDutyCostArgs): Promise<DutyCostType | null> {
  if (incoterms === 'DAP') return null
  try {
    const duty = await getDutyByHsCodeCountry(hsn.code, des_country)
    if (typeof duty === 'number') {
      return {
        label: `Duty ${duty.toFixed(2)}%`,
        usd: (duty * value) / 100,
        inr: ((duty * value) / 100) * USD_TO_INR,
        percent: duty,
      }
    }
  } catch (error) {
    console.log({ error })
  }
  return null
}

// Helper to build quote table data
interface BuildQuoteTableDataArgs {
  airFreight: LabeledCost
  terminalCost: LabeledCost
  ams: LabeledCost
  awb: LabeledCost
  pickupLTL: LabeledCost | null
  destinationLTL: LabeledCost | null
  incoterms: string
  ori_country: string
  CLEARANCE_FEE_OBJ: LabeledCost
  additionFeesBuilder: (
    data: LabeledCost[],
    incoterms: string,
    mode?: string
  ) => void
  dutyCost: DutyCostType | null
}
function buildQuoteTableData({
  airFreight,
  terminalCost,
  ams,
  awb,
  pickupLTL,
  destinationLTL,
  incoterms,
  ori_country,
  CLEARANCE_FEE_OBJ,
  additionFeesBuilder,
  dutyCost,
}: BuildQuoteTableDataArgs): LabeledCost[] {
  let quoteTableData: LabeledCost[] = [airFreight, terminalCost, ams, awb]
  if (pickupLTL) quoteTableData.splice(1, 0, pickupLTL)
  if (destinationLTL) {
    const insertIndex = pickupLTL ? 2 : 1
    quoteTableData.splice(insertIndex, 0, destinationLTL)
  }
  if (ori_country === 'IN') {
    quoteTableData.splice(2, 0, CLEARANCE_FEE_OBJ)
  }
  additionFeesBuilder(quoteTableData, incoterms, 'AIR')
  if (dutyCost) {
    quoteTableData.splice(quoteTableData.length - 2, 0, dutyCost)
  }
  return quoteTableData
}

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
      incoterms,
      hsn,
      value,
    } = validateData.data

    const dbUser = await getUser()

    if (!dbUser) {
      return NextResponse.json(
        { error: 'user not found please login again' },
        { status: 400 }
      )
    }
    const { name, email, companyName, phone } = dbUser

    if (!name || !email || !companyName || !phone) {
      return NextResponse.json(
        { error: 'user not found please login again' },
        { status: 400 }
      )
    }

    const { ton, cbm, kg } = air_cbm_ton

    // Prepare base cost objects
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
    const airFreight = { label: 'Air Freight', currency: 'USD', usd: 0, inr: 0 }

    // AIR Freight
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
    airFreight.usd = cheapestAirlineRecord.value * kg
    airFreight.inr = airFreight.usd * USD_TO_INR
    airFreight.label = `Air Freight:${cheapestAirlineRecord.name}(${cheapestAirlineRecord.value}$/kg)`

    let quoteTableData = [] as LabeledCost[]
    let tags = []
    let locations = []
    let dutyCost = null

    if (incoterms !== 'CIF' && incoterms !== 'FOB') {
      // Calculate LTLs
      const pickupLTL = await calculatePickupLTL({
        ori_country,
        pickup_check,
        pickup_location,
        ori_airport: {
          name: ori_airport.port_name,
          code: ori_airport.port_code,
          type: 'air',
          lat: ori_airport.lat,
          lng: ori_airport.lng,
        },
        ton,
        cbm,
        kg,
      })
      const destinationLTL = await calculateDestinationLTL({
        ori_country,
        delivery_check,
        delivery_location,
        des_airport: {
          name: des_airport.port_name,
          code: des_airport.port_code,
          type: 'air',
          lat: des_airport.lat,
          lng: des_airport.lng,
        },
        ton,
        cbm,
        kg,
      })
      terminalCost.usd = Math.max(375, 0.2 * airFreight.usd)
      terminalCost.inr = terminalCost.usd * USD_TO_INR
      // Duty
      dutyCost = await getDutyCost({ incoterms, hsn, des_country, value })
      // Build quote table
      quoteTableData = buildQuoteTableData({
        airFreight,
        terminalCost,
        ams,
        awb,
        pickupLTL,
        destinationLTL,
        incoterms,
        ori_country,
        CLEARANCE_FEE_OBJ,
        additionFeesBuilder: (data, incoterms, mode) =>
          appendAdditionFees({
            data,
            incoterms: incoterms as IncotermsType,
            mode: mode as OfferModeTypes,
            removeList: des_country !== 'US' ? ['ISF'] : [],
          }),
        dutyCost,
      })
    } else {
      quoteTableData = [airFreight]
    }

    // Calculate totals
    const { totalInrCost, totalUsdCost } = quoteTableData.reduce(
      (acc, item) => ({
        totalInrCost: acc.totalInrCost + item.inr,
        totalUsdCost: acc.totalUsdCost + item.usd,
      }),
      { totalInrCost: 0, totalUsdCost: 0 }
    )

    // Build tags and locations
    tags = buildTags({
      cbm,
      ton,
      incoterms,
      hsn,
      value,
      duty: dutyCost?.percent,
    })
    locations = buildLocations({
      pickup_check,
      pickup_location,
      ori_country,
      ori_airport: {
        name: ori_airport.port_name,
        code: ori_airport.port_code,
        type: 'air',
      },
      des_airport: {
        name: des_airport.port_name,
        code: des_airport.port_code,
        type: 'air',
      },
      delivery_check,
      delivery_location,
      des_country,
    })

    // Quote details
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        pickup_location,
        ori_port_rail: ori_airport,
        des_port_rail: des_airport,
        delivery_location,
        firstSlug: `AIR ${cbm.toFixed(2)} CBM ${ton.toFixed(2)} TON`,
        incoterms,
        shipline: cheapestAirlineRecord.name,
      })

    // FormId
    const formId = await createForm(validateData)
    const blok_quote_id = await generateOfferId()

    const offer_id = await createAirOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user_id: dbUser.id,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: ori_airport.port_code || '',
      end_code: des_airport.port_code || '',
      mode: 'AIR',
      service_type: ServiceType.AIR,
      package_type: `${cbm.toFixed(2)} CBM `,
      carrier: toTitleCase(cheapestAirlineRecord.name ?? 'Quater Airways'),
      estimated_days: cheapestAirlineRecord.transit_time,
      total_cost: { inr: totalInrCost, usd: totalUsdCost },
      pointDetination: pointDetination,
      tags,
      locations: locations,
      exchanges: exchangeValues(),
      offers: quoteTableData,
    })

    return NextResponse.json({ offer_id, quoteTableData }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error:
          'Air freight is not available for the selected route at this time. Please try another route or contact support for assistance.',
      },
      { status: 500 }
    )
  }
}
