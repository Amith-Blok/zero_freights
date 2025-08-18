import { getAllIndiaOutboundHaulageRatesByCode } from '@/data/india-outbound-haulage'
import { SeaFormSchema } from '@/schema/sea-schema'
import { NextRequest, NextResponse } from 'next/server'
import { filterHaulageRateByWeight } from '../helper/india-haulage-rate'
import { formatPhoneNumber, weightTOMetricTon } from '@/lib/utils'
import { formatLines } from '../helper/lines-rate-formatter'
import { generateOfferId, generateQuoteMetaDetails } from '../helper/lib'
import { inTrucking, usTrucking } from '../helper/trucking'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { appendAdditionalFees } from '../helper/table-data-appender'
import { getLinesChargesByCode } from '@/data/lines-charges'
import { exchangeValues } from '@/lib/exchange'
import { calculateTotalOfferCost } from '../helper/total'
import { createForm } from '@/data/form'
import {
  Location as LocationType,
  ServiceType,
} from '@/models/offer/shared-types'
import { toTitleCase } from '@/lib/utils'
import { createSeaFclOffer } from '@/data/offer/sea-fcl-offer'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'
import { getDutyByHsCodeCountry } from '@/data/duties'

// --- Constants ---
const CFS_CHARGE = 28000
const IN_FCL_CLEARANCE_FEE = {
  label: 'Clearance Fee',
  currency: 'INR',
  additional_notes: '',
  d2: CLEARANCE_FEE_OBJ.inr,
  d4: CLEARANCE_FEE_OBJ.inr,
  d5: CLEARANCE_FEE_OBJ.inr,
}

// --- Helper Functions ---
function errorResponse(message: string, status = 400, details?: any) {
  if (details) console.log({ error: message, details })
  else console.log({ error: message })
  return NextResponse.json({ error: message, details }, { status })
}

function selectPorts({
  ori_country,
  ori_port_rail,
  ori_port_if_rail,
  des_port_rail,
  des_port_if_rail,
}: any) {
  let startSeaPort, endSeaPort
  if (ori_country === 'IN') {
    startSeaPort =
      ori_port_rail.type === 'RAIL' ? ori_port_if_rail : ori_port_rail
    endSeaPort = des_port_rail
  } else {
    startSeaPort = ori_port_rail
    endSeaPort = des_port_rail.type == 'RAIL' ? des_port_if_rail : des_port_rail
  }
  return { startSeaPort, endSeaPort }
}

async function getRailCost({
  ori_country,
  ori_port_rail,
  des_country,
  des_port_rail,
  ori_port_if_rail,
  des_port_if_rail,
  fcl_unit,
  fcl_weights,
  fcl_quantities,
}: any) {
  const indianRail =
    ori_country == 'IN' && ori_port_rail.type == 'RAIL'
      ? ori_port_rail
      : des_country == 'IN' && des_port_rail.type == 'RAIL'
        ? des_port_rail
        : undefined
  const indianPortForRail =
    !!indianRail && (ori_country == 'IN' ? ori_port_if_rail : des_port_if_rail)
  let indianRailRate = undefined
  if (indianRail && indianPortForRail) {
    const IndiaOutboundHaulageRates =
      await getAllIndiaOutboundHaulageRatesByCode({
        start_code: indianRail.port_code,
        end_code: indianPortForRail.port_code,
      })
    indianRailRate = filterHaulageRateByWeight({
      haulageRates: IndiaOutboundHaulageRates,
      fcl_weights,
      fcl_unit,
      fcl_quantities,
    })
    if (!indianRailRate)
      throw Error("Couldn't find rail rate. Please try with other port")
  }
  return { indianRail, indianPortForRail, indianRailRate }
}

async function getTruckingCost({
  country,
  start,
  end,
  MetricTon,
  stuffingTimes,
}: any) {
  if (country == 'IN') {
    return await inTrucking({
      start_latitude: start.lat,
      start_longitude: start.lng,
      end_latitude: end.lat,
      end_longitude: end.lng,
      ton: MetricTon,
      times: stuffingTimes,
    })
  } else {
    return await usTrucking({
      start_latitude: start.lat,
      start_longitude: start.lng,
      end_latitude: end.lat,
      end_longitude: end.lng,
    })
  }
}

function buildLocations({
  pickup_check,
  pickup_location,
  ori_country,
  ori_port_rail,
  ori_port_if_rail,
  des_port_rail,
  des_port_if_rail,
  des_country,
  delivery_check,
  delivery_location,
}: any): LocationType[] {
  let locations: LocationType[] = []
  if (pickup_check) {
    locations.push({
      name: toTitleCase(pickup_location?.description ?? ''),
      code: ori_country.toUpperCase(),
      type: 'door',
    })
  }
  locations.push({
    name: toTitleCase(ori_port_rail.port_name.toUpperCase()),
    code: ori_port_rail.port_code.toUpperCase(),
    type: `${ori_port_rail.type === 'PORT' ? 'port' : 'rail'}`,
  })
  if (ori_port_rail.type == 'RAIL' && !!ori_port_if_rail?.port_name) {
    locations.push({
      name: toTitleCase(ori_port_if_rail?.port_name ?? ''),
      code: ori_port_if_rail?.port_code.toUpperCase() ?? '',
      type: 'port',
    })
  }
  if (des_port_rail.type == 'RAIL' && !!des_port_if_rail?.port_name) {
    locations.push({
      name: toTitleCase(des_port_if_rail?.port_name.toUpperCase() ?? ''),
      code: des_port_if_rail?.port_code.toUpperCase() ?? '',
      type: 'port',
    })
  }
  locations.push({
    name: toTitleCase(des_port_rail.port_name.toUpperCase()),
    code: des_port_rail.port_code.toUpperCase(),
    type: `${des_port_rail.type === 'PORT' ? 'port' : 'rail'}`,
  })
  if (delivery_check) {
    locations.push({
      name: delivery_location?.description ?? '',
      code: des_country,
      type: 'door',
    })
  }
  return locations
}

async function getDutyIfNeeded({ incoterms, hsn, des_country, value }: any) {
  if (incoterms !== 'DAP') {
    const duty = await getDutyByHsCodeCountry(hsn.code, des_country).catch(
      (error) => {
        console.log({ error })
        return undefined
      }
    )
    console.log({ duty })
    if (typeof duty === 'number') {
      return {
        label: `Duty ${duty.toFixed(2)}%`,
        currency: 'USD',
        additional_notes: `Duty:${duty}%`,
        d2: (duty * value) / 100,
        d4: (duty * value) / 100,
        d5: (duty * value) / 100,
        tag: `HS: ${hsn.code}`,
        valueTag: `${value} USD`,
        dutyTag: `DUTY: ${duty.toFixed(2)}%`,
      }
    }
  }
  return null
}

// --- Main Handler ---
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validateData = SeaFormSchema.safeParse(data)
    if (!validateData.success) {
      return errorResponse('invalid data')
    }
    const { modes } = validateData.data
    if (modes != 'FCL') {
      return errorResponse('this route is for sea fcl')
    }
    const {
      pickup_check,
      pickup_location,
      ori_country,
      ori_port_rail,
      ori_port_if_rail,
      delivery_check,
      delivery_location,
      des_country,
      des_port_rail,
      des_port_if_rail,
      fcl_unit,
      fcl_quantities,
      fcl_weights,
      fcl_container_type,
      trucking,
      incoterms,
      hsn,
      value,
      email,
      phone,
      company_name,
      user_name,
    } = validateData.data

    // --- Port Selection ---
    const { startSeaPort, endSeaPort } = selectPorts({
      ori_country,
      ori_port_rail,
      ori_port_if_rail,
      des_port_rail,
      des_port_if_rail,
    })

    // --- Calculate Metric Ton for each container type ---
    const containerMetricTons = {
      '20STD': 0,
      '40STD': 0,
      '40HC': 0,
    }

    Object.keys(fcl_quantities).forEach((containerType) => {
      const quantity =
        fcl_quantities[containerType as keyof typeof fcl_quantities]
      const weight = fcl_weights[containerType as keyof typeof fcl_weights]
      if (quantity > 0 && weight > 0) {
        containerMetricTons[containerType as keyof typeof containerMetricTons] =
          weightTOMetricTon({ weight: weight * quantity, unit: fcl_unit })
      }
    })

    let tags: string[] = [incoterms].filter(Boolean)

    // --- Shipline Rates ---
    const linesRates = await getLinesChargesByCode({
      start_code: startSeaPort?.port_code ?? '',
      end_code: endSeaPort?.port_code ?? '',
    }).catch((error) => {
      console.log({ error })
    })
    if (!linesRates) {
      return errorResponse(
        `there is no quote available for ${startSeaPort?.port_code}-> ${endSeaPort?.port_code}.Please try again with another ports`
      )
    }
    let quoteTableData = formatLines({
      linesCharges: linesRates,
      fclQuantities: fcl_quantities,
    }) as Record<string, any>
    if (!quoteTableData) {
      return errorResponse(
        'no something went wrong please retry with another form fields'
      )
    }

    let origin_trucking_days = 0
    let destionation_trucking_days = 0

    if (incoterms !== 'CIF' && incoterms !== 'FOB') {
      // --- Rail Cost ---
      const { indianRail, indianPortForRail, indianRailRate } =
        await getRailCost({
          ori_country,
          ori_port_rail,
          des_country,
          des_port_rail,
          ori_port_if_rail,
          des_port_if_rail,
          fcl_unit,
          fcl_weights,
          fcl_quantities,
        })
      if (indianRailRate && indianPortForRail) {
        quoteTableData.local_charges.splice(1, 0, {
          label: `Rail Cost ${indianRail?.port_code}-${indianPortForRail.port_code}`,
          currency: 'INR',
          additional_notes: '',
          d2: indianRailRate.d2,
          d4: indianRailRate.d4,
          d5: indianRailRate.d5,
        })
      }

      // --- Origin Trucking ---
      const stuffingTimes = ori_country === 'IN' && trucking === 'CFS' ? 1 : 2
      let originTrucking = { cost: 0, estimatedDays: 0, d2: 0, d4: 0, d5: 0 }
      if (pickup_check && pickup_location?.place_id) {
        const { lat: oriLat, lng: oriLng } = await getGoogleLocationByPlaceId(
          pickup_location.place_id
        )
        // Calculate trucking cost for each container type
        const containerTypes = ['20STD', '40STD', '40HC'] as const
        const truckingPromises = containerTypes.map(async (containerType) => {
          if (containerMetricTons[containerType] > 0) {
            const result = await getTruckingCost({
              country: ori_country,
              start: { lat: oriLat, lng: oriLng },
              end: { lat: ori_port_rail.lat, lng: ori_port_rail.lng },
              MetricTon: containerMetricTons[containerType],
              stuffingTimes,
            })
            return {
              containerType,
              cost: result.cost,
              estimatedDays: result.estimatedDays,
            }
          }
          return { containerType, cost: 0, estimatedDays: 0 }
        })

        const truckingResults = await Promise.all(truckingPromises)

        originTrucking.d2 =
          truckingResults.find((r) => r.containerType === '20STD')?.cost || 0
        originTrucking.d4 =
          truckingResults.find((r) => r.containerType === '40STD')?.cost || 0
        originTrucking.d5 =
          truckingResults.find((r) => r.containerType === '40HC')?.cost || 0
        originTrucking.estimatedDays = Math.max(
          ...truckingResults.map((r) => r.estimatedDays)
        )
      }
      if (
        originTrucking.d2 > 0 ||
        originTrucking.d4 > 0 ||
        originTrucking.d5 > 0
      ) {
        quoteTableData.local_charges.splice(1, 0, {
          label: `Origin Trucking ${ori_country}`,
          currency: `${ori_country == 'IN' ? 'INR' : 'USD'}`,
          additional_notes: '',
          d2: originTrucking.d2,
          d4: originTrucking.d4,
          d5: originTrucking.d5,
        })
      }
      if (pickup_check && trucking === 'CFS' && ori_country === 'IN') {
        quoteTableData.local_charges.splice(1, 0, {
          label: ' CFS charges',
          currency: 'INR',
          additional_notes: '',
          d2: CFS_CHARGE,
          d4: CFS_CHARGE,
          d5: CFS_CHARGE,
        })
      }
      origin_trucking_days = originTrucking.estimatedDays

      // --- Destination Trucking ---
      let destinationTrucking = {
        cost: 0,
        estimatedDays: 0,
        d2: 0,
        d4: 0,
        d5: 0,
      }
      if (delivery_check && delivery_location?.place_id) {
        const { lat: desLat, lng: desLng } = await getGoogleLocationByPlaceId(
          delivery_location.place_id
        )

        // Calculate trucking cost for each container type
        const containerTypes = ['20STD', '40STD', '40HC'] as const
        const truckingPromises = containerTypes.map(async (containerType) => {
          if (containerMetricTons[containerType] > 0) {
            const result = await getTruckingCost({
              country: des_country,
              start: { lat: desLat, lng: desLng },
              end: { lat: des_port_rail.lat, lng: des_port_rail.lng },
              MetricTon: containerMetricTons[containerType],
              stuffingTimes: 2,
            })
            return {
              containerType,
              cost: result.cost,
              estimatedDays: result.estimatedDays,
            }
          }
          return { containerType, cost: 0, estimatedDays: 0 }
        })

        const truckingResults = await Promise.all(truckingPromises)

        destinationTrucking.d2 =
          truckingResults.find((r) => r.containerType === '20STD')?.cost || 0
        destinationTrucking.d4 =
          truckingResults.find((r) => r.containerType === '40STD')?.cost || 0
        destinationTrucking.d5 =
          truckingResults.find((r) => r.containerType === '40HC')?.cost || 0
        destinationTrucking.estimatedDays = Math.max(
          ...truckingResults.map((r) => r.estimatedDays)
        )
      }
      if (
        destinationTrucking.d2 > 0 ||
        destinationTrucking.d4 > 0 ||
        destinationTrucking.d5 > 0
      ) {
        quoteTableData.local_charges.splice(
          quoteTableData.local_charges.length - 1,
          0,
          {
            label: `Destination Trucking ${des_country}`,
            currency: `${des_country == 'IN' ? 'INR' : 'USD'}`,
            additional_notes: '',
            d2: destinationTrucking.d2,
            d4: destinationTrucking.d4,
            d5: destinationTrucking.d5,
          }
        )
      }
      destionation_trucking_days = destinationTrucking.estimatedDays

      // --- Clearance Fee ---
      if (ori_country == 'IN' && incoterms !== 'DAP') {
        quoteTableData.local_charges.splice(1, 0, IN_FCL_CLEARANCE_FEE)
      }
      // --- Additional Fees ---
      appendAdditionalFees(quoteTableData.local_charges, incoterms)

      // --- Duty ---
      if (incoterms == 'DDP') {
        const dutyObj = await getDutyIfNeeded({
          incoterms,
          hsn,
          des_country,
          value,
        })
        if (dutyObj) {
          tags.push(dutyObj.tag)
          tags.push(dutyObj.valueTag)
          tags.push(dutyObj.dutyTag)
          quoteTableData.local_charges.splice(
            quoteTableData.local_charges.length - 4,
            0,
            dutyObj
          )
        } else {
          tags.push('DUTY: N/A')
        }
      }
    } else {
      quoteTableData.local_charges = []
    }

    // --- Calculate Totals ---
    for (let line of quoteTableData.line_charges) {
      const cost = calculateTotalOfferCost([
        line.data,
        ...quoteTableData.local_charges,
      ])
      line['total_cost'] = cost
      line['estimated_days'] =
        line.port_to_days + origin_trucking_days + destionation_trucking_days
    }

    // --- Locations ---
    const locations = buildLocations({
      pickup_check,
      pickup_location,
      ori_country,
      ori_port_rail,
      ori_port_if_rail,
      des_port_rail,
      des_port_if_rail,
      des_country,
      delivery_check,
      delivery_location,
    })

    // --- Create Form ---
    const formId = await createForm(validateData.data)

    // --- Quote Details ---
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        pickup_location: pickup_location ?? { description: '' },
        ori_port_rail,
        des_port_rail,
        delivery_location: pickup_location ?? { description: '' },
        shipline: '',
        firstSlug:
          'SEA FCL ' +
          fcl_quantities['20STD'] +
          ' x 20STD ' +
          fcl_quantities['40STD'] +
          ' x 40STD ' +
          fcl_quantities['40HC'] +
          ' x 40HC',
        incoterms,
      })
    const blok_quote_id = await generateOfferId()
    const user = {
      id: 'BLOK_UNKNOW_USER',
      name: toTitleCase(user_name) || '',
      email: email || '',
      company: toTitleCase(company_name) || '',
      phone: phone ? formatPhoneNumber(phone) : '',
    }
    const offer_id = await createSeaFclOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: startSeaPort?.port_code || '',
      end_code: endSeaPort?.port_code || '',
      mode: 'SEA_FCL',
      service_type: ServiceType.SEA_FCL,

      container_types: fcl_container_type,
      container_details: {
        d2: [fcl_quantities['20STD'], fcl_weights['20STD']],
        d4: [fcl_quantities['40STD'], fcl_weights['40STD']],
        d5: [fcl_quantities['40HC'], fcl_weights['40HC']],
      },
      weight_unit: fcl_unit,
      tags,
      locations: locations as any,
      exchanges: exchangeValues(),
      offers: quoteTableData as any,
    })

    return NextResponse.json({ offer_id, quoteTableData }, { status: 200 })
  } catch (error) {
    return errorResponse('exception error sea fcl route:', 500, error)
  }
}
