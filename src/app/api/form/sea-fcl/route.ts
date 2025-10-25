import { SeaFormSchema } from '@/schema/sea-schema'
import { NextRequest, NextResponse } from 'next/server'
import { weightTOMetricTon } from '@/lib/utils'
import { formatLines } from '../helper/lines-rate-formatter'
import { generateOfferId, generateQuoteMetaDetails } from '../helper/lib'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { appendSeaFclAdditionalFees } from '../helper/table-data-appender'
import { getLinesChargesByCode } from '@/data/lines-charges'
import { exchangeValues } from '@/lib/exchange'
import { calculateTotalOfferCost } from '../helper/total'
import { createForm } from '@/data/form'
import { ServiceType } from '@/models/offer/shared-types'
import { createSeaFclOffer } from '@/data/offer/sea-fcl-offer'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'
import { getUser } from '@/lib/user'
import {
  buildLocations,
  errorResponse,
  getDutyIfNeeded,
  getTruckingCost,
} from './helper'
import { selectPorts } from './helper'
import { getRailCost } from './helper'

// --- Constants ---
const CFS_CHARGE = 28000
let IN_FCL_CLEARANCE_FEE = {
  label: 'Clearance Fee',
  currency: 'INR',
  additional_notes: '',
  d2: CLEARANCE_FEE_OBJ.inr,
  d4: CLEARANCE_FEE_OBJ.inr,
  d5: CLEARANCE_FEE_OBJ.inr,
  total: 0,
}

// --- Main Handler ---
export async function POST(request: NextRequest) {
  try {
    const dbUser = await getUser()

    if (!dbUser) {
      return errorResponse('user not found please login again')
    }
    const { name, email, companyName, phone } = dbUser

    if (!name || !email || !companyName || !phone) {
      return errorResponse('user not found please login again')
    }

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
    } = validateData.data

    //--- Calculate total quantity of containers ---
    const totalQuantity =
      (fcl_quantities['20STD'] || 0) +
      (fcl_quantities['40STD'] || 0) +
      (fcl_quantities['40HC'] || 0)

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
        fcl_quantities[containerType as keyof typeof fcl_quantities] || 0
      const weight = fcl_weights[containerType as keyof typeof fcl_weights] || 0
      if (quantity > 0 && weight > 0) {
        containerMetricTons[containerType as keyof typeof containerMetricTons] =
          weightTOMetricTon({ weight: weight * quantity, unit: fcl_unit })
      }
    })

    let tags: string[] = []
    fcl_container_type.forEach((containerType) => {
      tags.push(
        `${fcl_quantities[containerType] || 0} x ${containerType} (${fcl_weights[containerType] || 0}${fcl_unit})`
      )
    })
    tags.push(incoterms)

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
          unit: fcl_unit,
          weights: fcl_weights,
          quantities: fcl_quantities,
        })
      if (indianRailRate && indianPortForRail) {
        quoteTableData.local_charges.splice(1, 0, {
          label: `Rail Cost ${indianRail?.port_code}-${indianPortForRail.port_code}`,
          currency: 'INR',
          additional_notes: '',
          d2: indianRailRate.d2,
          d4: indianRailRate.d4,
          d5: indianRailRate.d5,
          total: indianRailRate.total,
        })
      }

      // --- Origin Trucking ---
      const stuffingTimes = ori_country === 'IN' && trucking === 'CFS' ? 1 : 2
      let originTrucking = { d2: 0, d4: 0, d5: 0, total: 0, estimatedDays: 0 }
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
          total: originTrucking.d2 + originTrucking.d4 + originTrucking.d5,
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
          total: CFS_CHARGE * 3,
        })
      }
      origin_trucking_days = originTrucking.estimatedDays

      // --- Destination Trucking ---
      let destinationTrucking = {
        d2: 0,
        d4: 0,
        d5: 0,
        total: 0,
        estimatedDays: 0,
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
            total:
              destinationTrucking.d2 +
              destinationTrucking.d4 +
              destinationTrucking.d5,
          }
        )
      }
      destionation_trucking_days = destinationTrucking.estimatedDays

      // --- Clearance Fee ---
      if (ori_country == 'IN' && incoterms !== 'DAP') {
        IN_FCL_CLEARANCE_FEE.total = CLEARANCE_FEE_OBJ.inr * totalQuantity
        quoteTableData.local_charges.splice(1, 0, IN_FCL_CLEARANCE_FEE)
      }
      // --- Additional Fees ---
      const removeList = des_country !== 'US' ? ['ISF'] : []
      appendSeaFclAdditionalFees({
        data: quoteTableData.local_charges,
        incoterms,
        removeList,
      })

      // --- Duty ---
      if (incoterms == 'DDP') {
        const dutyObj = await getDutyIfNeeded({
          incoterms,
          hsn,
          des_country,
          value,
          totalQuantity,
        })
        if (dutyObj) {
          tags.push(dutyObj.tag)
          tags.push(dutyObj.valueTag)
          tags.push(dutyObj.dutyTag)
          quoteTableData.local_charges.splice(
            quoteTableData.local_charges.length - 4,
            0,
            {
              label: dutyObj.label,
              currency: dutyObj.currency,
              additional_notes: dutyObj.additional_notes,
              d2: dutyObj.d2,
              d4: dutyObj.d4,
              d5: dutyObj.d5,
              total: dutyObj.total,
            }
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
      const total_cost = calculateTotalOfferCost([
        line.data,
        ...quoteTableData.local_charges,
      ])
      const freight_cost = calculateTotalOfferCost([line.data])
      const local_cost = calculateTotalOfferCost([
        ...quoteTableData.local_charges,
      ])
      line['cost_breakdown'] = {
        total_cost,
        freight_cost,
        local_cost,
      }
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

    // --- Generate container details ---
    let containerDetails: Record<string, { quantity: number; weight: number }> =
      {}
    fcl_container_type.forEach((containerType) => {
      if (containerType === '20STD') {
        containerDetails['d2'] = {
          quantity: fcl_quantities['20STD'] || 0,
          weight: fcl_weights['20STD'] || 0,
        }
      }
      if (containerType === '40STD') {
        containerDetails['d4'] = {
          quantity: fcl_quantities['40STD'] || 0,
          weight: fcl_weights['40STD'] || 0,
        }
      }
      if (containerType === '40HC') {
        containerDetails['d5'] = {
          quantity: fcl_quantities['40HC'] || 0,
          weight: fcl_weights['40HC'] || 0,
        }
      }
    })

    // --- Create Form ---
    const formId = await createForm(validateData.data)

    // --- Quote Details ---
    let firstSlug = `SEA FCL `
    fcl_container_type.forEach((containerType) => {
      firstSlug += `${fcl_quantities[containerType] || 0} x ${containerType} (${fcl_weights[containerType] || 0}${fcl_unit}) `
    })
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        pickup_location: pickup_location ?? { description: '' },
        ori_port_rail,
        des_port_rail,
        delivery_location: pickup_location ?? { description: '' },
        shipline: '',
        firstSlug: firstSlug,
        incoterms,
      })
    const blok_quote_id = await generateOfferId()

    const offer_id = await createSeaFclOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user_id: dbUser.id,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: startSeaPort?.port_code || '',
      end_code: endSeaPort?.port_code || '',
      mode: 'SEA_FCL',
      service_type: ServiceType.SEA_FCL,
      container_types: fcl_container_type,
      container_details: containerDetails,
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
