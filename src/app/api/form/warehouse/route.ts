import { NextRequest, NextResponse } from 'next/server'
import {
  generateQuoteMetaDetails,
  generateQuoteTableData,
  randomIdGenerator,
} from '../helper/lib'
// import { appendAdditionalFees } from '../helper/table-data-appender'
import { sendQuoteInfoToTeam } from '@/lib/mail'
import { createQuote } from '@/data/quotes'
import { WarehouseFormSchema } from '@/schema/warehouse-schema'
import { getWarehouseByPortCode } from '@/data/warehouses'

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
    let pickupLocationDescription: string, cbmTon: { cbm: number; ton: number }

    if (is_google_location) {
      // TypeScript now knows this must be the Google schema
      pickupLocationDescription = (pickup_location as { description: string })
        .description
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

    const quoteTableData = generateQuoteTableData([
      perPalletIn,
      perPalletOut,
      truckingCost,
      storageCharge,
    ])

    //COMMENT: appended additional fees
    // appendAdditionalFees(quoteTableData)

    const totalSum = quoteTableData.reduce(
      (acc, item) => {
        return {
          totalInrCost: acc.totalInrCost + item.total_amount,
          totalUsdCost: acc.totalUsdCost + item.cost_usd,
          subtotalInrCost: acc.subtotalInrCost + item.cost_inr,
          gstFiveInrTotal:
            item.gst_percentage == 5
              ? acc.gstFiveInrTotal + item.gst_amount
              : acc.gstFiveInrTotal,
          gstEighteenInrTotal:
            item.gst_percentage == 18
              ? acc.gstEighteenInrTotal + item.gst_amount
              : acc.gstEighteenInrTotal,
        }
      },
      {
        totalInrCost: 0,
        totalUsdCost: 0,
        subtotalInrCost: 0,
        gstFiveInrTotal: 0,
        gstEighteenInrTotal: 0,
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
    //send email

    const quote_id = await createQuote({
      blok_quote_id: randomIdGenerator(),
      user_id: email,
      user_name,
      subject,
      quote_date: new Date(),
      user_company: company_name,
      place_of_supply: placeOfSupply,
      bill_to: pointDetination,
      total_inr: totalSum.totalInrCost,
      sub_total_inr_cost: totalSum.subtotalInrCost,
      gst_eighteen_inr_cost: totalSum.gstEighteenInrTotal,
      gst_five_inr_cost: totalSum.gstFiveInrTotal,
      total_usd: totalSum.totalUsdCost,
      line: 'All',
      line_quotation_number: '#' + new Date().getTime(),
      estimated_day: 0,
      valid_from: new Date().toLocaleDateString('en-CA'),
      valid_to: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString('en-CA'),
      routing: [],
      form_data: validateData.data,
      data: quoteTableData,
    })
    await sendQuoteInfoToTeam({
      user_name,
      subject,
      total: totalSum.totalInrCost,
      quoteLink: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.quote.bloksupplychain.com'}/quote/${quote_id}`,
      company_name,
      phone_number: phone,
      email,
    })
    return NextResponse.json(
      {
        quote_id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error: `no quote for this request. Please try again with another form input `,
      },
      { status: 500 }
    )
  }
}
