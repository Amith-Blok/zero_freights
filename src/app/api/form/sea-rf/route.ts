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
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'
import { getUser } from '@/lib/user'
import {
  buildLocations,
  errorResponse,
  getDutyIfNeeded,
  getRailCost,
  selectPorts,
} from '../sea-fcl/helper'
import { createSeaRfOffer } from '@/data/offer/sea-rf-offer'
import { getTerminalHandlingChargeByCode } from '@/data/terminal-handling-charges'
import {
  calculateDestinationGensetCharge,
  calculateOriginGensetCharge,
  getSeaRfTruckingCost,
} from './helper'

// --- Constants ---
let IN_RF_CLEARANCE_FEE = {
  label: 'Clearance Fee',
  currency: 'INR',
  additional_notes: '',
  d2: CLEARANCE_FEE_OBJ.inr,
  d4: CLEARANCE_FEE_OBJ.inr,
  d5: CLEARANCE_FEE_OBJ.inr,
  total: 0,
}

let RF_FREIGHT_MULTIPLIER = 3

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
    if (modes != 'RF') {
      return errorResponse('this route is for sea rf')
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
      rf_unit,
      rf_temperture,
      rf_humidity,
      rf_quantities,
      rf_weights,
      rf_container_type,
      trucking,
      incoterms,
      hsn,
      value,
    } = validateData.data

    //--- Calculate total quantity of containers ---
    const totalQuantity =
      (rf_quantities['20STD'] || 0) +
      (rf_quantities['40STD'] || 0) +
      (rf_quantities['40HC'] || 0)

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

    Object.keys(rf_quantities).forEach((containerType) => {
      const quantity =
        rf_quantities[containerType as keyof typeof rf_quantities] || 0
      const weight = rf_weights[containerType as keyof typeof rf_weights] || 0
      if (quantity > 0 && weight > 0) {
        containerMetricTons[containerType as keyof typeof containerMetricTons] =
          weightTOMetricTon({ weight: weight * quantity, unit: rf_unit })
      }
    })

    let tags: string[] = []
    rf_container_type.forEach((containerType) => {
      tags.push(
        `${rf_quantities[containerType] || 0} x ${containerType} (${rf_weights[containerType] || 0}${rf_unit})`
      )
    })
    tags.push(rf_temperture.toString() + '°C')
    tags.push(rf_humidity.toString() + '%')
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

    if (
      linesRates.lines[0].sections[0].data.find(
        (item: any) => item.code === 'SEA'
      )
    ) {
      for (let line of linesRates.lines) {
        const seaCharge = line.sections[0].data.find(
          (item) => item.code == 'SEA'
        )
        if (!seaCharge) continue
        seaCharge.d2 = seaCharge.d2 * RF_FREIGHT_MULTIPLIER
        seaCharge.d4 = seaCharge.d4 * RF_FREIGHT_MULTIPLIER
        seaCharge.d5 = seaCharge.d5 * RF_FREIGHT_MULTIPLIER
      }
    } else {
      console.log({ linesRates })
      return NextResponse.json({ error: 'failed' }, { status: 500 })
    }

    if (
      linesRates.lines[0].sections[1].data.find(
        (item: any) => item.code === 'THO'
      ) &&
      ori_country === 'IN'
    ) {
      const terminalHandlingCharge = await getTerminalHandlingChargeByCode(
        startSeaPort?.port_code ?? ''
      ).catch((error) => {
        console.log({ error })
        return null
      })
      if (!terminalHandlingCharge) {
        // Remove the item with code 'THO' from the data array instead of zeroing out values
        const thoIndex = linesRates.lines[0].sections[1].data.findIndex(
          (item: any) => item.code === 'THO'
        )
        if (thoIndex !== -1) {
          linesRates.lines[0].sections[1].data.splice(thoIndex, 1)
        }
      } else {
        linesRates.lines[0].sections[1].data.find(
          (item: any) => item.code === 'THO'
        )!.d2 = terminalHandlingCharge.h2
        linesRates.lines[0].sections[1].data.find(
          (item: any) => item.code === 'THO'
        )!.d4 = terminalHandlingCharge.h4
        linesRates.lines[0].sections[1].data.find(
          (item: any) => item.code === 'THO'
        )!.d5 = terminalHandlingCharge.h4
      }
    }

    let quoteTableData = formatLines({
      linesCharges: linesRates,
      fclQuantities: rf_quantities,
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
          unit: rf_unit,
          weights: rf_weights,
          quantities: rf_quantities,
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
      let originTrucking = {
        d2: 0,
        d4: 0,
        d5: 0,
        total: 0,
        estimatedDays: 0,
        distance: 0,
      }
      let orginGensetCharge = { d2: 0, d4: 0, d5: 0, total: 0 }
      if (pickup_check && pickup_location?.place_id) {
        const { lat: oriLat, lng: oriLng } = await getGoogleLocationByPlaceId(
          pickup_location.place_id
        )
        // Calculate trucking cost for each container type
        const containerTypes = ['20STD', '40STD', '40HC'] as const
        const truckingPromises = containerTypes.map(async (containerType) => {
          if (containerMetricTons[containerType] > 0) {
            const result = await getSeaRfTruckingCost({
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
              distance: result.distance,
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
        orginGensetCharge.d2 = calculateOriginGensetCharge({
          distance:
            truckingResults.find((r) => r.containerType === '20STD')
              ?.distance || 0,
          temperature: rf_temperture,
        })
        orginGensetCharge.d4 = calculateOriginGensetCharge({
          distance:
            truckingResults.find((r) => r.containerType === '40STD')
              ?.distance || 0,
          temperature: rf_temperture,
        })
        orginGensetCharge.d5 = calculateOriginGensetCharge({
          distance:
            truckingResults.find((r) => r.containerType === '40HC')?.distance ||
            0,
          temperature: rf_temperture,
        })
        orginGensetCharge.total =
          orginGensetCharge.d2 + orginGensetCharge.d4 + orginGensetCharge.d5
      }
      if (
        originTrucking.d2 > 0 ||
        originTrucking.d4 > 0 ||
        originTrucking.d5 > 0
      ) {
        //ADD ORIGIN TRUCKING COST TO THE QUOTE TABLE
        quoteTableData.local_charges.splice(1, 0, {
          label: `Origin Trucking ${ori_country}`,
          currency: `${ori_country == 'IN' ? 'INR' : 'USD'}`,
          additional_notes: '',
          d2: originTrucking.d2,
          d4: originTrucking.d4,
          d5: originTrucking.d5,
          total: originTrucking.d2 + originTrucking.d4 + originTrucking.d5,
        })

        //ADD GENSET CHARGE TO THE QUOTE TABLE
        quoteTableData.local_charges.splice(2, 0, {
          label: `Origin Genset Charge`,
          currency: `USD`,
          additional_notes: '',
          d2: orginGensetCharge.d2,
          d4: orginGensetCharge.d4,
          d5: orginGensetCharge.d5,
          total: orginGensetCharge.total,
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
      let destinationGensetCharge = { d2: 0, d4: 0, d5: 0, total: 0 }
      if (delivery_check && delivery_location?.place_id) {
        const { lat: desLat, lng: desLng } = await getGoogleLocationByPlaceId(
          delivery_location.place_id
        )

        // Calculate trucking cost for each container type
        const containerTypes = ['20STD', '40STD', '40HC'] as const
        const truckingPromises = containerTypes.map(async (containerType) => {
          if (containerMetricTons[containerType] > 0) {
            const result = await getSeaRfTruckingCost({
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
              distance: result.distance,
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
        destinationGensetCharge.d2 = calculateDestinationGensetCharge({
          distance:
            truckingResults.find((r) => r.containerType === '20STD')
              ?.distance || 0,
        })
        destinationGensetCharge.d4 = calculateDestinationGensetCharge({
          distance:
            truckingResults.find((r) => r.containerType === '40STD')
              ?.distance || 0,
        })
        destinationGensetCharge.d5 = calculateDestinationGensetCharge({
          distance:
            truckingResults.find((r) => r.containerType === '40HC')?.distance ||
            0,
        })
        destinationGensetCharge.total =
          destinationGensetCharge.d2 +
          destinationGensetCharge.d4 +
          destinationGensetCharge.d5
      }
      if (
        destinationTrucking.d2 > 0 ||
        destinationTrucking.d4 > 0 ||
        destinationTrucking.d5 > 0
      ) {
        //ADD DESTINATION TRUCKING COST TO THE QUOTE TABLE
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

        //ADD DESTINATION GENSET CHARGE TO THE QUOTE TABLE
        quoteTableData.local_charges.splice(
          quoteTableData.local_charges.length - 1,
          0,
          {
            label: `Destination Genset Charge`,
            currency: `USD`,
            additional_notes: '',
            d2: destinationGensetCharge.d2,
            d4: destinationGensetCharge.d4,
            d5: destinationGensetCharge.d5,
            total: destinationGensetCharge.total,
          }
        )
      }
      destionation_trucking_days = destinationTrucking.estimatedDays

      // --- Clearance Fee ---
      if (ori_country == 'IN' && incoterms !== 'DAP') {
        IN_RF_CLEARANCE_FEE.total = CLEARANCE_FEE_OBJ.inr * totalQuantity
        quoteTableData.local_charges.splice(1, 0, IN_RF_CLEARANCE_FEE)
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
    rf_container_type.forEach((containerType) => {
      if (containerType === '20STD') {
        containerDetails['d2'] = {
          quantity: rf_quantities['20STD'] || 0,
          weight: rf_weights['20STD'] || 0,
        }
      }
      if (containerType === '40STD') {
        containerDetails['d4'] = {
          quantity: rf_quantities['40STD'] || 0,
          weight: rf_weights['40STD'] || 0,
        }
      }
      if (containerType === '40HC') {
        containerDetails['d5'] = {
          quantity: rf_quantities['40HC'] || 0,
          weight: rf_weights['40HC'] || 0,
        }
      }
    })

    // --- Create Form ---
    const formId = await createForm(validateData.data)

    // --- Quote Details ---
    let firstSlug = `SEA RF `
    rf_container_type.forEach((containerType) => {
      firstSlug += `${rf_quantities[containerType] || 0} x ${containerType} (${rf_weights[containerType] || 0}${rf_unit}) `
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

    const offer_id = await createSeaRfOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user_id: dbUser.id,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: startSeaPort?.port_code || '',
      end_code: endSeaPort?.port_code || '',
      humidity: rf_humidity,
      temperature: rf_temperture,
      mode: 'SEA_RF',
      service_type: ServiceType.SEA_RF,
      container_types: rf_container_type,
      container_details: containerDetails,
      weight_unit: rf_unit,
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
