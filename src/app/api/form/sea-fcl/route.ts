import { getAllIndiaOutboundHaulageRatesByCode } from '@/data/india-outbound-haulage'
import { SeaFormSchema } from '@/schema/sea-schema'
import { NextRequest, NextResponse } from 'next/server'
import { filterHaulageRateByWeight } from '../helper/india-haulage-rate'
import { formatPhoneNumber, weightTOMetricTon } from '@/lib/utils'
import { formatLines } from '../helper/lines-rate-formatter'
import { generateQuoteMetaDetails, randomIdGenerator } from '../helper/lib'
import { inTrucking, usTrucking } from '../helper/trucking'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { appendAdditionalFees } from '../helper/table-data-appender'
import { getLinesChargesByCode } from '@/data/lines-charges'
import { exchangeValues } from '@/lib/exchange'
import { calculateTotalOfferCost } from '../helper/total'
import { createForm } from '@/data/form'
import { Location as LocationType } from '@/models/offer/shared-types'
import { toTitleCase } from '@/lib/utils'
import { createSeaFclOffer } from '@/data/offer/sea-fcl-offer'
import { convertFclToStdContainer } from '@/lib/container'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validateData = SeaFormSchema.safeParse(data)
    if (!validateData.success) {
      return NextResponse.json({ error: 'invalid data' }, { status: 400 })
    }
    const { modes } = validateData.data
    if (modes != 'FCL') {
      return NextResponse.json(
        { error: 'this route is for sea fcl' },
        { status: 400 }
      )
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
      fcl_quantity,
      fcl_weight,
      fcl_container_type,
      trucking,
      icoterms,
      email,
      phone,
      company_name,
      user_name,
    } = validateData.data

    const IN_FCL_CLEARANCE_FEE = {
      label: 'Clearance Fee',
      currency: 'INR',
      additional_notes: '',
      d2: CLEARANCE_FEE_OBJ.inr,
      d4: CLEARANCE_FEE_OBJ.inr,
      d5: CLEARANCE_FEE_OBJ.inr,
    }

    // Shipline rates
    let startSeaPort, endSeaPort
    if (ori_country === 'IN') {
      startSeaPort =
        ori_port_rail.type === 'RAIL' ? ori_port_if_rail : ori_port_rail
      endSeaPort = des_port_rail
    } else {
      startSeaPort = ori_port_rail
      endSeaPort =
        des_port_rail.type == 'RAIL' ? des_port_if_rail : des_port_rail
    }

    const linesRates = await getLinesChargesByCode({
      start_code: startSeaPort?.port_code ?? '',
      end_code: endSeaPort?.port_code ?? '',
    }).catch((error) => {
      console.log({ error })
    })
    if (!linesRates) {
      return NextResponse.json(
        {
          error: `there is no quote available for ${startSeaPort?.port_code}-> ${endSeaPort?.port_code}.Please try again with another ports`,
        },
        { status: 400 }
      )
    }

    let quoteTableData = formatLines({ linesCharges: linesRates }) as Record<
      string,
      any
    >

    if (!quoteTableData) {
      return NextResponse.json(
        {
          error:
            'no something went wrong please retry with another form fields',
        },
        { status: 400 }
      )
    }

    // //find rail cost if ori_port_rail or des_port_rail is RAIL
    // //TODO:rename it as something rail origin
    const indianRail =
      ori_country == 'IN' && ori_port_rail.type == 'RAIL'
        ? ori_port_rail
        : des_country == 'IN' && des_port_rail.type == 'RAIL'
          ? des_port_rail
          : undefined
    //TODO:rename it as something rail destination
    const indianPortForRail =
      !!indianRail &&
      (ori_country == 'IN' ? ori_port_if_rail : des_port_if_rail)

    let indianRailRate = undefined
    const MetricTon = weightTOMetricTon({ unit: fcl_unit, weight: fcl_weight })
    if (indianRail && indianPortForRail) {
      //TODO: this code is only for outbound Future implement Inbound rail
      const IndiaOutboundHaulageRates =
        await getAllIndiaOutboundHaulageRatesByCode({
          start_code: indianRail.port_code,
          end_code: indianPortForRail.port_code,
        })
      // console.log({IndiaOutboundHaulageRates})
      // console.log({MetricTon})
      indianRailRate = filterHaulageRateByWeight({
        haulageRates: IndiaOutboundHaulageRates,
        ton: MetricTon,
      })
      if (!indianRailRate) {
        throw Error("Couldn't find rail rate. Please try with other port")
      }
      // console.log({ indianRailRate });
    }

    if (indianRailRate && indianPortForRail) {
      //   //TODO: index change accroding to ori or des
      quoteTableData.local_charges.splice(1, 0, {
        label: `Rail Cost ${indianRail?.port_code}-${indianPortForRail.port_code}`,
        currency: 'INR',
        additional_notes: '',
        d2: indianRailRate.d2,
        d4: indianRailRate.d4,
        d5: indianRailRate.d5,
      })
    }

    //origin trucking
    const stuffingTimes = ori_country === 'IN' && trucking === 'CFS' ? 1 : 2
    let originTrucking = { cost: 0, estimatedDays: 0 }
    if (pickup_check && pickup_location?.place_id) {
      const { lat: oriLat, lng: oriLng } = await getGoogleLocationByPlaceId(
        pickup_location.place_id
      )
      if (ori_country == 'IN') {
        originTrucking = await inTrucking({
          start_latitude: oriLat,
          start_longitude: oriLng,
          end_latitude: ori_port_rail.lat,
          end_longitude: ori_port_rail.lng,
          ton: MetricTon,
          times: stuffingTimes,
        })
      } else {
        originTrucking = await usTrucking({
          start_latitude: oriLat,
          start_longitude: oriLng,
          end_latitude: ori_port_rail.lat,
          end_longitude: ori_port_rail.lng,
        })
      }
      //Add Origin Trucking Cost
      quoteTableData.local_charges.splice(0, 0, {
        label: `Origin Trucking ${ori_country}`,
        currency: `${ori_country == 'IN' ? 'INR' : 'USD'}`,
        additional_notes: '',
        d2: originTrucking.cost,
        d4: originTrucking.cost,
        d5: originTrucking.cost,
      })
    }
    const origin_trucking_days = originTrucking.estimatedDays
    //des trucking
    let destinationTrucking = { cost: 0, estimatedDays: 0 }
    if (delivery_check && delivery_location?.place_id) {
      const { lat: desLat, lng: desLng } = await getGoogleLocationByPlaceId(
        delivery_location.place_id
      )
      if (des_country == 'IN') {
        destinationTrucking = await inTrucking({
          start_latitude: desLat,
          start_longitude: desLng,
          end_latitude: des_port_rail.lat,
          end_longitude: des_port_rail.lng,
          ton: MetricTon,
        })
      } else {
        destinationTrucking = await usTrucking({
          start_latitude: desLat,
          start_longitude: desLng,
          end_latitude: des_port_rail.lat,
          end_longitude: des_port_rail.lng,
        })
      }
    }
    //Add Des Trucking Cost
    quoteTableData.local_charges.splice(
      quoteTableData.local_charges.length - 1,
      0,
      {
        label: `Destination Trucking ${des_country}`,
        currency: `${des_country == 'IN' ? 'INR' : 'USD'}`,
        additional_notes: '',
        d2: destinationTrucking.cost,
        d4: destinationTrucking.cost,
        d5: destinationTrucking.cost,
      }
    )

    const destionation_trucking_days = destinationTrucking.estimatedDays

    //TODO: generate Location
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
    //COMMENT: added clearance fee if origin is india
    if (ori_country == 'IN') {
      quoteTableData.local_charges.splice(1, 0, IN_FCL_CLEARANCE_FEE)
    }
    //COMMENT: append additional fees
    appendAdditionalFees(quoteTableData.local_charges)

    //Calculate Total Sum for INR and USD for all lines
    for (let line of quoteTableData.line_charges) {
      const cost = calculateTotalOfferCost([
        line.data,
        ...quoteTableData.local_charges,
      ])
      line['total_cost'] = cost
      line['estimated_days'] =
        line.port_to_days + origin_trucking_days + destionation_trucking_days
    }

    //create form
    const formId = await createForm(validateData.data)

    //quote details
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        pickup_location: pickup_location ?? { description: '' },
        ori_port_rail,
        des_port_rail,
        delivery_location: pickup_location ?? { description: '' },
        //TODO: make shipline dynamic
        shipline: '',
        firstSlug: 'SEA FCL ' + fcl_quantity + ' x ' + fcl_container_type,
        icoterms,
      })

    //TODO: Hubspot deal created
    //
    const blok_quote_id = randomIdGenerator()
    // console.log({ blok_quote_id });
    const user = {
      id: 'BLOK_UNKNOW_USER',
      name: toTitleCase(user_name) || '',
      email: email || '',
      company: toTitleCase(company_name) || '',
      phone: phone ? formatPhoneNumber(phone) : '',
    }
    const offer_id = await createSeaFclOffer({
      offer_id: blok_quote_id,
      form_id: formId,
      user,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: startSeaPort?.port_code || '',
      end_code: endSeaPort?.port_code || '',
      mode: 'SEA_FCL',
      tags: ['FCL'],
      container_type: fcl_container_type,
      package_type: convertFclToStdContainer(fcl_container_type),
      delivery_type: 'door_to_door',
      locations: locations as any,
      exchanges: exchangeValues(),
      offers: quoteTableData as any,
    })

    //TODO: Not require move it to quote api
    // await sendQuoteInfoToTeam({
    //   user_name,
    //   subject,
    //   total: totalSum.totalInrCost,
    //   quoteLink: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.quote.bloksupplychain.com'}/quote/${quote_id}`,
    //   company_name,
    //   phone_number: phone,
    //   email,
    // })
    return NextResponse.json({ offer_id, quoteTableData }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: 'exception error sea fcl route:',
      details: error,
    })
  }
}
