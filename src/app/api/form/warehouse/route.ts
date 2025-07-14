import { NextRequest, NextResponse } from 'next/server'
import {
  formateRateInfoToConfirmQuoteData,
  generateQuoteMetaDetails,
  randomIdGenerator,
} from '../helper/lib'

import { WarehouseFormSchema } from '@/schema/warehouse-schema'
import { getWarehouseByPortCode } from '@/data/warehouses'
// import { newAppendAdditionalFees } from '../helper/table-data-appender'
import { RateInfoType } from '@/types/common'
import { createForm } from '@/data/form'
import { createWarehouseOffer } from '@/data/offer/warehouse-offer'
import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import { exchangeValues } from '@/lib/exchange'
import { Location, LocationType } from '@/models/offer/shared-types'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validateData = WarehouseFormSchema.safeParse(data)
    if (!validateData.success) {
      return NextResponse.json({ error: 'invalid data' }, { status: 400 })
    }
    const {
      modes,
      is_google_location,
      country,
      pickup_location,
      dg,
      delivery_location,
      storage_days,
      icoterms,
      user_name,
      company_name,
      email,
      phone,
    } = validateData.data

    // Narrow the type based on `is_google_location`
    let pickupLocationDescription: string,
      cbmTon: { cbm: number; ton: number },
      pickupLocationType: LocationType = 'port'

    if (is_google_location) {
      // TypeScript now knows this must be the Google schema
      pickupLocationDescription = (pickup_location as { description: string })
        .description
      pickupLocationType = 'door'
    } else {
      // TypeScript now knows this must be the Port schema
      pickupLocationDescription = (pickup_location as { port_name: string })
        .port_name
    }

    let totalPallet: number = 1

    const truckingCost = {
      name: `Trucking (${delivery_location.port_name})`,
      code: 'WAREHOUSE_TRUCKING',
      currency: 'USD',
      value: 0,
    }

    const perPalletIn = {
      name: 'Pallet In Cost',
      code: 'PALLET_IN_COST',
      currency: 'USD',
      value: 0,
    }

    const perPalletOut = {
      name: 'Pallet Out Cost',
      code: 'PALLET_OUT_COST',
      currency: 'USD',
      value: 0,
    }

    const storageCharge = {
      name: 'Storage Charge',
      code: 'STORAGE_CHARGE',
      currency: 'USD',
      value: 0,
    }
    if (modes === 'FCL_WAREHOUSE') {
      const { fcl_load, fcl_cbm_ton } = validateData.data
      const { cbm } = fcl_cbm_ton
      cbmTon = fcl_cbm_ton
      totalPallet = fcl_load.reduce(
        (acc, value) => (value.fcl_quantity ? acc + value.fcl_quantity : 0),
        0
      )
      perPalletIn.value = cbm <= 1.2 ? 12.5 * totalPallet : 15 * totalPallet
      perPalletOut.value = perPalletIn.value
      storageCharge.value = !dg
        ? 1.5 * cbm * storage_days
        : 4.5 * cbm * storage_days
    } else if (modes == 'LCL_WAREHOUSE') {
      const { lcl_load, lcl_cbm_ton } = validateData.data
      const { cbm } = lcl_cbm_ton
      cbmTon = lcl_cbm_ton
      totalPallet = lcl_load.reduce(
        (acc, value) => (value.lcl_quantity ? acc + value.lcl_quantity : 0),
        0
      )
      perPalletIn.value = cbm <= 1.2 ? 12.5 * totalPallet : 15 * totalPallet
      perPalletOut.value = perPalletIn.value
      storageCharge.value = !dg
        ? 1.5 * cbm * storage_days
        : 4.5 * cbm * storage_days
    } else if (modes == 'LTL_WAREHOUSE') {
      if (pickupLocationType !== 'door') {
        pickupLocationType = 'air'
      }
      const { ltl_load, ltl_cbm_ton } = validateData.data
      const { cbm } = ltl_cbm_ton
      cbmTon = ltl_cbm_ton
      totalPallet = ltl_load.reduce(
        (acc, value) => (value.ltl_quantity ? acc + value.ltl_quantity : 0),
        0
      )
      perPalletIn.value = cbm <= 1.2 ? 12.5 * totalPallet : 15 * totalPallet
      perPalletOut.value = perPalletIn.value
      storageCharge.value = !dg
        ? 1.5 * cbm * storage_days
        : 4.5 * cbm * storage_days
    } else {
      throw new Error('invalid warehouse mode')
    }
    truckingCost.value =
      (await getWarehouseByPortCode(delivery_location.port_code)).cost ?? 0

    const formatedQuoteTableData = formateRateInfoToConfirmQuoteData([
      perPalletIn,
      perPalletOut,
      truckingCost,
      storageCharge,
    ] as RateInfoType[])

    // COMMENT: added clearance fee if country is IN
    //  if (country == 'IN') {
    //     formatedQuoteTableData.splice(1, 0, CLEARANCE_FEE_OBJ)
    //   }

    const { totalInrCost, totalUsdCost } = formatedQuoteTableData.reduce(
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

    let firstSlug = `Warehouse ${modes} ${cbmTon.cbm.toFixed(2)} CBM ${cbmTon.ton.toFixed(2)} TON FROM ${pickupLocationDescription}  To ${delivery_location.port_name} (${icoterms}`

    //quote details
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        ori_port_rail: {
          port_name: pickupLocationDescription,
        },
        des_port_rail: { port_name: delivery_location.port_code },
        firstSlug,
        icoterms,
      })

    let locations: Location[] = []
    locations.push({
      name: pickupLocationDescription,
      code: country.toUpperCase(),
      type: pickupLocationType,
    })
    locations.push({
      name: delivery_location.port_name,
      code: country.toUpperCase(),
      type: 'warehouse',
    })

    //FormId
    const formId = await createForm(validateData)

    const blok_quote_id = randomIdGenerator()
    const user = {
      id: 'BLOK_UNKNOW_USER',
      name: toTitleCase(user_name) || '',
      email: email || '',
      company: toTitleCase(company_name) || '',
      phone: phone ? formatPhoneNumber(phone) : '',
    }
    const offer_id = await createWarehouseOffer({
      offer_id: blok_quote_id,
      form_id: formId,
      user,
      subject,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      start_code: pickup_location.place_id || '',
      end_code: delivery_location?.port_code || '',
      mode: 'WAR',
      tags: ['WAREHOUSE'],
      package_type: `${cbmTon.cbm.toFixed(2)} CBM`,
      carrier: 'Forward Air',
      estimated_days: storage_days,
      total_cost: { inr: totalInrCost, usd: totalUsdCost },
      pointDetination: `${cbmTon.cbm.toFixed(2)} CBM ${cbmTon.ton.toFixed(2)} TON`,
      delivery_type: 'door_to_door',
      locations: locations,
      exchanges: exchangeValues(),
      offers: formatedQuoteTableData,
    })

    return NextResponse.json(
      { offer_id, formatedQuoteTableData },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error: `no quote for this request. Please try again with another form input. Error:${error} `,
      },
      { status: 500 }
    )
  }
}
