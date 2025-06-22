/* eslint-disable no-unused-vars */
import { SeaFormSchema } from '@/schema/sea-schema'
import { NextRequest, NextResponse } from 'next/server'
import { getLCLSeaFreightCostByCode } from '@/data/lcl-sea-freight'
import {
  inLtlTruckingCost,
  usLtlTruckingCost,
} from '@/app/api/form/helper/trucking'
import { getGoogleLocationByPlaceId } from '@/app/api/form/helper/google-map'
import {
  generateQuoteMetaDetails,
  generateQuoteTableData,
  randomIdGenerator,
} from '../helper/lib'

import { createQuote } from '@/data/quotes'
import { appendAdditionalFees } from '../helper/table-data-appender'
import { sendQuoteInfoToTeam } from '@/lib/mail'
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validateData = SeaFormSchema.safeParse(data)
    if (!validateData.success) {
      return NextResponse.json({ error: 'invalid data' }, { status: 400 })
    }
    const { modes } = validateData.data
    if (modes != 'LCL') {
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
      delivery_check,
      delivery_location,
      des_port_rail,
      lcl_cbm_ton,
      icoterms,
      user_name,
      company_name,
      email,
      phone,
    } = validateData.data

    const seaLclFreight = {
      name: 'LCL Sea Freight',
      code: 'BLOK_SEA_LCL_FREIGHT',
      currency: 'USD',
      value: 0,
    }
    const terminalCharge = {
      name: 'Terminal Charge',
      code: 'TERMINAL_CHARGE',
      currency: 'INR',
      value: 0,
    }
    const docCharge = {
      name: 'DOC Charge',
      code: 'DOC_CHARGE',
      currency: 'INR',
      value: 0,
    }
    const vgmCharge = {
      name: 'VGM Charge',
      code: 'VGM_CHARGE',
      currency: 'USD',
      value: 0,
    }
    const ddcCharge = {
      name: 'DDC Charge',
      code: 'DDC_CHARGE',
      currency: 'USD',
      value: 0,
    }
    const loadUnLoadFee = {
      name: 'Load Unload Fee',
      code: 'LOAD_UNLOAD_FEE',
      currency: 'USD',
      value: 0,
    }
    const chasisFee = {
      name: 'Chasis Fee',
      code: 'CHASIS_FEE',
      currency: 'USD',
      value: 0,
    }
    const pickupLTL = {
      name: 'Pickup LTL',
      code: 'PICKUP_LTL',
      currency: ori_country == 'IN' ? 'INR' : 'USD',
      value: 0,
    }
    const destinationLTL = {
      name: 'Destination LTL',
      code: 'DESTINATION_LTL',
      currency: ori_country == 'IN' ? 'USD' : 'INR',
      value: 0,
    }

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
    let { cbm, ton, kg } = lcl_cbm_ton
    let lbsPerHundred = (ton * 2204.62) / 100
    loadUnLoadFee.value = Math.max(97, lbsPerHundred * 5.02)
    seaLclFreight.value = seaFreightCostDB * cbm
    terminalCharge.value = Math.max(
      1250 * Math.max(2, cbm),
      1750 * Math.max(2, ton)
    )
    docCharge.value = 4250
    vgmCharge.value = 20 * cbm
    ddcCharge.value = Math.max(50, 28.1 * cbm)
    chasisFee.value = Math.max(15, Math.max(5 * cbm, 5 * ton))

    //pickupLTL and deliveryLTL
    if (ori_country == 'IN') {
      //pickup INDIA country trucking

      if (pickup_check && pickup_location) {
        const { lat: pickupLocationLat, lng: pickupLocationLng } =
          await getGoogleLocationByPlaceId(pickup_location.place_id)
        pickupLTL.value = await inLtlTruckingCost({
          start_latitude: ori_port_rail.lat,
          start_longitude: ori_port_rail.lng,
          end_latitude: pickupLocationLat,
          end_longitude: pickupLocationLng,
          ton,
          cbm,
        })
      }

      //delivery USA or other country trucking
      if (delivery_check && delivery_location) {
        destinationLTL.value =
          (await usLtlTruckingCost({
            zipcode: delivery_location.zipcode || '',
            kg,
          })) ?? 0
      }
    } else {
      //pickup us or other country trucking
      if (pickup_check && pickup_location) {
        destinationLTL.value =
          (await usLtlTruckingCost({
            zipcode: pickup_location.zipcode || '',
            kg,
          })) ?? 0
      }

      //destionation  india country trucking
      if (delivery_check && delivery_location) {
        const { lat: deliveryLocationLat, lng: deliveryLocationLng } =
          await getGoogleLocationByPlaceId(delivery_location.place_id)
        destinationLTL.value = await inLtlTruckingCost({
          start_latitude: des_port_rail.lat,
          start_longitude: des_port_rail.lng,
          end_latitude: deliveryLocationLat,
          end_longitude: deliveryLocationLng,
          ton,
          cbm,
        })
      }
    }
    //quote table data
    const quoteTableData = generateQuoteTableData([
      seaLclFreight,
      pickupLTL,
      terminalCharge,
      docCharge,
      vgmCharge,
      ddcCharge,
      chasisFee,
      loadUnLoadFee,
      destinationLTL,
    ])

    //COMMENT: append additional fees
    appendAdditionalFees(quoteTableData)

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
    //quote details
    const { pointDetination, placeOfSupply, subject } =
      generateQuoteMetaDetails({
        pickup_location: pickup_location ?? { description: '' },
        ori_port_rail,
        des_port_rail,
        delivery_location: delivery_location ?? { description: '' },
        firstSlug: `SEA LCL ${cbm.toFixed(2)} CBM ${ton.toFixed(2)} TON`,
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
        error: 'exception error sea lcl route:',
        details: error,
      },
      { status: 500 }
    )
  }
}
