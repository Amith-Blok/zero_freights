import { SeaFormSchema } from '@/schema/sea-schema'
import { NextRequest, NextResponse } from 'next/server'
import { generateOfferId, generateQuoteMetaDetails } from '../helper/lib'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { appendSeaIgAdditionalFees } from '../helper/table-data-appender'
import { getLinesChargesByCode } from '@/data/lines-charges'
import { exchangeValues } from '@/lib/exchange'
import { calculateIgTotalOfferCost } from '../helper/total'
import { createForm } from '@/data/form'
import { ServiceType } from '@/models/offer/shared-types'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'
import { getUser } from '@/lib/user'
import {
  buildLocations,
  errorResponse,
  getTruckingCost,
  selectPorts,
} from '../sea-fcl/helper'
import { getIgDutyIfNeeded, getIgRailCost, IgLineFormatter } from './helper'
import { createSeaIgOffer } from '@/data/offer/sea-ig-offer'

// --- Constants ---
let IN_IG_CLEARANCE_FEE = {
  label: 'Clearance Fee',
  currency: 'INR',
  additional_notes: '',
  ot2: CLEARANCE_FEE_OBJ.inr,
  ot4: CLEARANCE_FEE_OBJ.inr,
  fr2: CLEARANCE_FEE_OBJ.inr,
  fr4: CLEARANCE_FEE_OBJ.inr,
  fr5: CLEARANCE_FEE_OBJ.inr,
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
    if (modes != 'IG') {
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
      ig_unit,
      ig_quantities,
      ig_weights,
      ig_container_type,
      trucking,
      incoterms,
      hsn,
      value,
    } = validateData.data

    //--- Calculate total quantity of containers ---
    const totalQuantity =
      (ig_quantities['OT20'] || 0) +
      (ig_quantities['OT40'] || 0) +
      (ig_quantities['FR20'] || 0) +
      (ig_quantities['FR40'] || 0) +
      (ig_quantities['FR45'] || 0)

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
      OT20: 0,
      OT40: 0,
      FR20: 0,
      FR40: 0,
      FR45: 0,
    }

    let tags: string[] = []
    ig_container_type.forEach((containerType) => {
      tags.push(
        `${ig_quantities[containerType] || 0} x ${containerType} (${ig_weights[containerType] || 0}${ig_unit})`
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

    let quoteTableData = IgLineFormatter({
      linesRates,
      igQuantities: ig_quantities,
    }) as Record<string, any>
    if (!quoteTableData) {
      return errorResponse(
        'no something went wrong please retry with another form fields'
      )
    }
    console.log('____Quote Table____')
    console.log({ quoteTableData })
    let origin_trucking_days = 0
    let destionation_trucking_days = 0

    if (incoterms !== 'CIF' && incoterms !== 'FOB') {
      // --- Rail Cost ---
      const railCostResult = await getIgRailCost({
        ori_country,
        ori_port_rail,
        des_country,
        des_port_rail,
        ori_port_if_rail,
        des_port_if_rail,
        unit: ig_unit,
        weights: ig_weights,
        quantities: ig_quantities,
      })
      if (railCostResult?.indianRailRate && railCostResult?.indianPortForRail) {
        const { indianRail, indianPortForRail, indianRailRate } = railCostResult
        quoteTableData.local_charges.splice(1, 0, {
          label: `Rail Cost ${indianRail?.port_code}-${indianPortForRail.port_code}`,
          currency: 'INR',
          additional_notes: '',
          ot2: indianRailRate.ot2,
          ot4: indianRailRate.ot4,
          fr2: indianRailRate.fr2,
          fr4: indianRailRate.fr4,
          fr5: indianRailRate.fr5,
          total: indianRailRate.total,
        })
      }

      // --- Origin Trucking ---
      const stuffingTimes = ori_country === 'IN' && trucking === 'CFS' ? 1 : 2
      let originTrucking = {
        ot2: 0,
        ot4: 0,
        fr2: 0,
        fr4: 0,
        fr5: 0,
        total: 0,
        estimatedDays: 0,
      }
      if (pickup_check && pickup_location?.place_id) {
        const { lat: oriLat, lng: oriLng } = await getGoogleLocationByPlaceId(
          pickup_location.place_id
        )
        // Calculate trucking cost for each container type
        const containerTypes = ['OT20', 'OT40', 'FR20', 'FR40', 'FR45'] as const
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

        originTrucking.ot2 =
          truckingResults.find((r) => r.containerType === 'OT20')?.cost || 0
        originTrucking.ot4 =
          truckingResults.find((r) => r.containerType === 'OT40')?.cost || 0
        originTrucking.fr2 =
          truckingResults.find((r) => r.containerType === 'FR20')?.cost || 0
        originTrucking.fr4 =
          truckingResults.find((r) => r.containerType === 'FR40')?.cost || 0
        originTrucking.fr5 =
          truckingResults.find((r) => r.containerType === 'FR45')?.cost || 0
        originTrucking.estimatedDays = Math.max(
          ...truckingResults.map((r) => r.estimatedDays)
        )
      }
      if (
        originTrucking.ot2 > 0 ||
        originTrucking.ot4 > 0 ||
        originTrucking.fr2 > 0 ||
        originTrucking.fr4 > 0 ||
        originTrucking.fr5 > 0
      ) {
        quoteTableData.local_charges.splice(1, 0, {
          label: `Origin Trucking ${ori_country}`,
          currency: `${ori_country == 'IN' ? 'INR' : 'USD'}`,
          additional_notes: '',
          ot2: originTrucking.ot2,
          ot4: originTrucking.ot4,
          fr2: originTrucking.fr2,
          fr4: originTrucking.fr4,
          fr5: originTrucking.fr5,
          total:
            originTrucking.ot2 +
            originTrucking.ot4 +
            originTrucking.fr2 +
            originTrucking.fr4 +
            originTrucking.fr5,
        })
      }

      origin_trucking_days = originTrucking.estimatedDays

      // --- Destination Trucking ---
      let destinationTrucking = {
        ot2: 0,
        ot4: 0,
        fr2: 0,
        fr4: 0,
        fr5: 0,
        total: 0,
        estimatedDays: 0,
      }
      if (delivery_check && delivery_location?.place_id) {
        const { lat: desLat, lng: desLng } = await getGoogleLocationByPlaceId(
          delivery_location.place_id
        )

        // Calculate trucking cost for each container type
        const containerTypes = ['OT20', 'OT40', 'FR20', 'FR40', 'FR45'] as const
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

        destinationTrucking.ot2 =
          truckingResults.find((r) => r.containerType === 'OT20')?.cost || 0
        destinationTrucking.ot4 =
          truckingResults.find((r) => r.containerType === 'OT40')?.cost || 0
        destinationTrucking.fr2 =
          truckingResults.find((r) => r.containerType === 'FR20')?.cost || 0
        destinationTrucking.fr4 =
          truckingResults.find((r) => r.containerType === 'FR40')?.cost || 0
        destinationTrucking.fr5 =
          truckingResults.find((r) => r.containerType === 'FR45')?.cost || 0
        destinationTrucking.estimatedDays = Math.max(
          ...truckingResults.map((r) => r.estimatedDays)
        )
      }
      if (
        destinationTrucking.ot2 > 0 ||
        destinationTrucking.ot4 > 0 ||
        destinationTrucking.fr2 > 0 ||
        destinationTrucking.fr4 > 0 ||
        destinationTrucking.fr5 > 0
      ) {
        quoteTableData.local_charges.splice(
          quoteTableData.local_charges.length - 1,
          0,
          {
            label: `Destination Trucking ${des_country}`,
            currency: `${des_country == 'IN' ? 'INR' : 'USD'}`,
            additional_notes: '',
            ot2: destinationTrucking.ot2,
            ot4: destinationTrucking.ot4,
            fr2: destinationTrucking.fr2,
            fr4: destinationTrucking.fr4,
            fr5: destinationTrucking.fr5,
            total:
              destinationTrucking.ot2 +
              destinationTrucking.ot4 +
              destinationTrucking.fr2 +
              destinationTrucking.fr4 +
              destinationTrucking.fr5,
          }
        )
      }
      destionation_trucking_days = destinationTrucking.estimatedDays

      // --- Clearance Fee ---
      if (ori_country == 'IN' && incoterms !== 'DAP') {
        IN_IG_CLEARANCE_FEE.total = CLEARANCE_FEE_OBJ.inr * totalQuantity
        quoteTableData.local_charges.splice(1, 0, IN_IG_CLEARANCE_FEE)
      }

      // --- Additional Fees ---
      const removeList = des_country !== 'US' ? ['ISF'] : []
      appendSeaIgAdditionalFees({
        data: quoteTableData.local_charges,
        incoterms,
        removeList,
      })

      // --- Duty ---
      if (incoterms == 'DDP') {
        const dutyObj = await getIgDutyIfNeeded({
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
              ot2: dutyObj.ot2,
              ot4: dutyObj.ot4,
              fr2: dutyObj.fr2,
              fr4: dutyObj.fr4,
              fr5: dutyObj.fr5,
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
      const total_cost = calculateIgTotalOfferCost([
        line.data,
        ...quoteTableData.local_charges,
      ])
      const freight_cost = calculateIgTotalOfferCost([line.data])
      const local_cost = calculateIgTotalOfferCost([
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
    ig_container_type.forEach((containerType) => {
      if (containerType === 'OT20') {
        containerDetails['ot2'] = {
          quantity: ig_quantities[containerType] || 0,
          weight: ig_weights[containerType] || 0,
        }
      }
      if (containerType === 'OT40') {
        containerDetails['ot4'] = {
          quantity: ig_quantities[containerType] || 0,
          weight: ig_weights[containerType] || 0,
        }
      }
      if (containerType === 'FR20') {
        containerDetails['fr2'] = {
          quantity: ig_quantities[containerType] || 0,
          weight: ig_weights[containerType] || 0,
        }
      }
      if (containerType === 'FR40') {
        containerDetails['fr4'] = {
          quantity: ig_quantities[containerType] || 0,
          weight: ig_weights[containerType] || 0,
        }
      }
      if (containerType === 'FR45') {
        containerDetails['fr5'] = {
          quantity: ig_quantities[containerType] || 0,
          weight: ig_weights[containerType] || 0,
        }
      }
    })

    // --- Create Form ---
    const formId = await createForm(validateData.data)

    // --- Quote Details ---
    let firstSlug = `SEA IG `
    ig_container_type.forEach((containerType) => {
      firstSlug += `${ig_quantities[containerType] || 0} x ${containerType} (${ig_weights[containerType] || 0}${ig_unit}) `
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

    console.log('____Offer Data____')
    console.log({ quoteTableData: JSON.stringify(quoteTableData, null, 2) })
    const offer_id = await createSeaIgOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user_id: dbUser.id,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: startSeaPort?.port_code || '',
      end_code: endSeaPort?.port_code || '',
      mode: 'SEA_IG',
      service_type: ServiceType.SEA_IG,
      container_types: ig_container_type,
      container_details: containerDetails,
      weight_unit: ig_unit,
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
