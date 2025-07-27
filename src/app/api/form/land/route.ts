import { NextRequest, NextResponse } from 'next/server'
import {
  inLtlTruckingCost,
  inTrucking,
  newUsLtlTruckingCost,
  usTrucking,
} from '../helper/trucking'
import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { generateQuoteMetaDetails, generateOfferId } from '../helper/lib'
import { newAppendAdditionalFees } from '../helper/table-data-appender'
import { LandFormSchema } from '@/schema/land-schema'
import { formatPhoneNumber, toTitleCase, weightTOMetricTon } from '@/lib/utils'
import { currencyConverter, exchangeValues } from '@/lib/exchange'
import { ConfimredQuoteDataType } from '@/models/confirmed-quote'
import { Location, ServiceType } from '@/models/offer/shared-types'
import { createForm } from '@/data/form'
import { createLandOffer } from '@/data/offer/land'
import { convertFclToStdContainer } from '@/lib/container'
import { CLEARANCE_FEE_OBJ } from '@/constants/us-custom'
import { getDutyByHsCodeCountry } from '@/data/duties'
import { USD_TO_INR } from '@/constants'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validateData = LandFormSchema.safeParse(data)
    if (!validateData.success) {
      return NextResponse.json({ error: 'invalid data' }, { status: 400 })
    }
    const {
      modes,
      country,
      pickup_location,
      delivery_location,
      incoterms,
      hsn,
      value,
      user_name,
      company_name,
      email,
      phone,
    } = validateData.data
    let firstSlug = ''
    let pickupLocationDescription = ''
    let serviceType: ServiceType
    const truckingCost = {
      label: '',
      usd: 0,
      inr: 0,
    }
    const pickupLocationData: Location = {
      name: '',
      code: '',
      type: 'door',
    }
    let packageLabel = ''
    let tags: string[] = []
    if (modes === 'SEAPORT_TRUCKING') {
      serviceType = ServiceType.SEAPORT_TRUCKING
      const { sea_container_type } = validateData.data
      packageLabel = convertFclToStdContainer(sea_container_type)
      //SEAPORT TRUCKING
      pickupLocationData.type = 'port'
      pickupLocationData.code = pickup_location.port_code
      pickupLocationData.name = pickup_location.port_name

      truckingCost.label = 'trucking cost(FTL)'
      const { sea_quantity, sea_unit, sea_weight } = validateData.data
      tags.push(
        `${sea_quantity} x ${convertFclToStdContainer(sea_container_type)}`
      )
      if (sea_weight) {
        tags.push(`${sea_weight.toFixed(2)} ${sea_unit}`)
      }
      const totalWeight = sea_quantity * sea_weight
      const totalMetricTon = weightTOMetricTon({
        unit: sea_unit,
        weight: totalWeight,
      })

      firstSlug = `${modes} ${totalMetricTon.toFixed()} TON`
      pickupLocationDescription = pickup_location.port_name
      const { lat: deliveryLat, lng: deliveryLng } =
        await getGoogleLocationByPlaceId(delivery_location.place_id)
      if (country == 'IN') {
        truckingCost.inr = await inTrucking({
          start_latitude: pickup_location.lat,
          start_longitude: pickup_location.lng,
          end_latitude: deliveryLat,
          end_longitude: deliveryLng,
          ton: totalMetricTon,
        }).then((res) => res.cost)

        truckingCost.usd = currencyConverter({
          cost: truckingCost.inr,
          sourceCurrency: 'INR',
          targetCurrency: 'USD',
        })
      } else {
        truckingCost.usd = await usTrucking({
          start_latitude: pickup_location.lat,
          start_longitude: pickup_location.lng,
          end_latitude: deliveryLat,
          end_longitude: deliveryLng,
        }).then((res) => res.cost)

        truckingCost.inr = currencyConverter({
          cost: truckingCost.usd,
          sourceCurrency: 'USD',
          targetCurrency: 'INR',
        })
      }
    } else if (modes == 'DOMESTIC_TRUCKING') {
      serviceType = ServiceType.DOMESTIC_TRUCKING
      const { domestic_cbm_ton } = validateData.data
      packageLabel = `${domestic_cbm_ton.cbm.toFixed(2)} CBM`
      tags.push(`${domestic_cbm_ton.cbm.toFixed(2)} CBM `)
      tags.push(`${domestic_cbm_ton.ton.toFixed(2)} TON `)
      //Pick up location data
      pickupLocationData.type = 'door'
      pickupLocationData.code = country
      pickupLocationData.name = pickup_location.description

      truckingCost.label = 'Trucking Cost(LTL)'
      const {
        domestic_cbm_ton: { ton, cbm, kg },
      } = validateData.data

      firstSlug = `${modes} ${cbm.toFixed(2)} CBM ${ton.toFixed()} TON`
      pickupLocationDescription = pickup_location?.description ?? ''

      const { lat: deliveryLat, lng: deliveryLng } =
        await getGoogleLocationByPlaceId(delivery_location.place_id)
      console.log({ deliveryLat, deliveryLng, pickup_location })
      const { lat: pickupLat, lng: pickupLng } =
        await getGoogleLocationByPlaceId(pickup_location.place_id)
      if (country == 'IN') {
        truckingCost.inr = await inLtlTruckingCost({
          start_latitude: pickupLat,
          start_longitude: pickupLng,
          end_latitude: deliveryLat,
          end_longitude: deliveryLng,
          ton,
          cbm,
        })
        truckingCost.usd = currencyConverter({
          cost: truckingCost.inr,
          sourceCurrency: 'INR',
          targetCurrency: 'USD',
        })
      } else {
        const usLtl = await newUsLtlTruckingCost({
          start_latitude: pickupLat,
          start_longitude: pickupLng,
          end_latitude: deliveryLat,
          end_longitude: deliveryLng,
          weight: kg,
          unit: 'KG',
          cbm,
        })
        truckingCost.usd = usLtl ?? 0
        truckingCost.inr = currencyConverter({
          cost: truckingCost.usd,
          sourceCurrency: 'USD',
          targetCurrency: 'INR',
        })
      }
    } else if (modes == 'AIRPORT_TRUCKING') {
      serviceType = ServiceType.AIRPORT_TRUCKING
      const { airport_cbm_ton } = validateData.data
      packageLabel = `${airport_cbm_ton.cbm.toFixed(2)} CBM`
      tags.push(`${airport_cbm_ton.cbm.toFixed(2)} CBM `)
      tags.push(`${airport_cbm_ton.ton.toFixed(2)} TON `)
      //Pickup location data
      pickupLocationData.type = 'air'
      pickupLocationData.code = country
      pickupLocationData.name = pickup_location.port_name
      truckingCost.label = 'Trucking Cost(LTL)'

      const {
        airport_cbm_ton: { ton, cbm, kg },
      } = validateData.data

      firstSlug = `${modes} ${cbm.toFixed(2)} CBM ${ton.toFixed()} TON`
      pickupLocationDescription = pickup_location.port_name ?? ''

      const { lat: deliveryLat, lng: deliveryLng } =
        await getGoogleLocationByPlaceId(delivery_location.place_id)
      console.log({ deliveryLat, deliveryLng, pickup_location })
      if (country == 'IN') {
        truckingCost.inr = await inLtlTruckingCost({
          start_latitude: pickup_location.lat,
          start_longitude: pickup_location.lng,
          end_latitude: deliveryLat,
          end_longitude: deliveryLng,
          ton,
          cbm,
        })
        truckingCost.usd = currencyConverter({
          cost: truckingCost.inr,
          sourceCurrency: 'INR',
          targetCurrency: 'USD',
        })
      } else {
        const usLtl = await newUsLtlTruckingCost({
          start_latitude: pickup_location.lat,
          start_longitude: pickup_location.lng,
          end_latitude: deliveryLat,
          end_longitude: deliveryLng,
          weight: kg,
          unit: 'KG',
          cbm,
        })

        if (!usLtl) {
          throw new Error('not found')
        }

        truckingCost.usd = usLtl
        truckingCost.inr = currencyConverter({
          cost: truckingCost.usd,
          sourceCurrency: 'USD',
          targetCurrency: 'INR',
        })
      }
    } else {
      throw new Error('invalid land mode')
    }
    tags.push(incoterms)

    const quoteTableData = [truckingCost] as ConfimredQuoteDataType[]
    //COMMENT: added clearance fee if origin is india
    if (country == 'IN' && incoterms !== 'DAP') {
      quoteTableData.splice(1, 0, CLEARANCE_FEE_OBJ)
    }
    // //COMMENT: appended additional fees
    newAppendAdditionalFees(quoteTableData, incoterms)
    let duty
    if (incoterms !== 'DAP') {
      duty = await getDutyByHsCodeCountry(hsn.code, country).catch((error) => {
        console.log({ error })
        return undefined
      })
    }
    if (duty && typeof duty === 'number') {
      tags.push(`HS: ${hsn.code}`)
      tags.push(`${value} USD`)
      const dutyCost = (duty * value) / 100
      quoteTableData.splice(quoteTableData.length - 2, 0, {
        label: `Duty ${duty.toFixed(2)}%`,
        usd: dutyCost,
        inr: dutyCost * USD_TO_INR,
      })
    }
    //Location generate location details
    let locations: Location[] = []

    locations.push(pickupLocationData)
    locations.push({
      name: delivery_location.description,
      code: country,
      type: 'door',
    })

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
        ori_port_rail: {
          port_name: pickupLocationDescription,
        },
        des_port_rail: { port_name: delivery_location.description },
        firstSlug,
        incoterms,
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
    const offer_id = await createLandOffer({
      blok_id: blok_quote_id,
      form_id: formId,
      user,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: pickupLocationDescription || '',
      end_code: delivery_location.description || '',
      mode: 'LAND',
      service_type: serviceType,
      package_type: packageLabel,
      carrier: 'Land Freight',
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
        error: `no quote for this request. Please try again with another form input `,
        details: error,
      },
      { status: 500 }
    )
  }
}
