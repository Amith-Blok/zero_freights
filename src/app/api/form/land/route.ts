import { NextRequest, NextResponse } from 'next/server'
// import {
//   inLtlTruckingCost,
//   inTrucking,
//   usLtlTruckingCost,
//   usTrucking,
// } from '../helper/trucking'
// import { getGoogleLocationByPlaceId } from '../helper/google-map'
// import {
//   generateQuoteMetaDetails,
//   generateQuoteTableData,
//   randomIdGenerator,
// } from '../helper/lib'
// // import { appendAdditionalFees } from '../helper/table-data-appender'
// import { sendQuoteInfoToTeam } from '@/lib/mail'
// import { createQuote } from '@/data/quotes'
// import { LandFormSchema } from '@/schema/land-schema'
// import { weightTOMetricTon } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log(data)
    // const validateData = LandFormSchema.safeParse(data)
    // if (!validateData.success) {
    //   return NextResponse.json({ error: 'invalid data' }, { status: 400 })
    // }
    // const {
    //   modes,
    //   country,
    //   pickup_location,
    //   delivery_location,
    //   icoterms,
    //   user_name,
    //   company_name,
    //   email,
    //   phone,
    // } = validateData.data
    // let firstSlug = ''
    // let pickupLocationDescription = ''
    // const truckingCost = {
    //   name: '',
    //   code: '',
    //   currency: country == 'IN' ? 'INR' : 'USD',
    //   value: 0,
    // }

    // // if (modes === 'SEAPORT_TRUCKING') {
    // //   truckingCost.name = 'trucking cost(FTL)'
    // //   truckingCost.code = 'FTL'
    // //   const { sea_quantity, sea_unit, sea_weight } = validateData.data
    // //   const totalWeight = sea_quantity * sea_weight
    // //   const totalMetricTon = weightTOMetricTon({
    // //     unit: sea_unit,
    // //     weight: totalWeight,
    // //   })

    // //   firstSlug = `${modes} ${totalMetricTon.toFixed()} TON`
    // //   pickupLocationDescription = pickup_location.port_name
    // //   const { lat: deliveryLat, lng: deliveryLng } =
    // //     await getGoogleLocationByPlaceId(delivery_location.place_id)
    // //   truckingCost.value =
    // //     country == 'IN'
    // //       ? await inTrucking({
    // //         start_latitude: pickup_location.lat,
    // //         start_longitude: pickup_location.lng,
    // //         end_latitude: deliveryLat,
    // //         end_longitude: deliveryLng,
    // //         ton: totalMetricTon,
    // //       })
    // //       : await usTrucking({
    // //         start_latitude: pickup_location.lat,
    // //         start_longitude: pickup_location.lng,
    // //         end_latitude: deliveryLat,
    // //         end_longitude: deliveryLng,
    // //       })
    // // } else if (modes == 'DOMESTIC_TRUCKING') {
    // //   truckingCost.name = 'Trucking Cost(LTL)'
    // //   truckingCost.code = 'PICKUP_LTL'

    // //   const {
    // //     domestic_cbm_ton: { ton, cbm, kg },
    // //   } = validateData.data

    // //   firstSlug = `${modes} ${cbm} CBM ${ton.toFixed()} TON`
    // //   pickupLocationDescription = pickup_location?.description ?? ''
    // //   const { lat: deliveryLat, lng: deliveryLng } =
    // //     await getGoogleLocationByPlaceId(delivery_location.place_id)
    // //   console.log({ deliveryLat, deliveryLng, pickup_location })
    // //   if (country == 'IN') {
    // //     const { lat: pickupLat, lng: pickupLng } =
    // //       await getGoogleLocationByPlaceId(pickup_location.place_id)
    // //     truckingCost.value = await inLtlTruckingCost({
    // //       start_latitude: pickupLat,
    // //       start_longitude: pickupLng,
    // //       end_latitude: deliveryLat,
    // //       end_longitude: deliveryLng,
    // //       ton,
    // //       cbm,
    // //     })
    // //   } else if (country == 'US') {
    // //     truckingCost.value =
    // //       (await usLtlTruckingCost({
    // //         zipcode: pickup_location.zipcode ?? '',
    // //         kg,
    // //       })) ?? 0
    // //   }
    // // } else if (modes == 'AIRPORT_TRUCKING') {
    // //   truckingCost.name = 'Trucking Cost(LTL)'
    // //   truckingCost.code = 'PICKUP_LTL'

    //   // const {
    //   //   airport_cbm_ton: { ton, cbm, kg },
    //   // } = validateData.data

    //   // firstSlug = `${modes} ${cbm} CBM ${ton.toFixed()} TON`
    //   // pickupLocationDescription = pickup_location.port_name ?? ''

    //   // const { lat: deliveryLat, lng: deliveryLng } =
    //   //   await getGoogleLocationByPlaceId(delivery_location.place_id)
    //   // console.log({ deliveryLat, deliveryLng, pickup_location })
    //   // if (country == 'IN') {
    //   //   truckingCost.value = await inLtlTruckingCost({
    //   //     start_latitude: pickup_location.lat,
    //   //     start_longitude: pickup_location.lng,
    //   //     end_latitude: deliveryLat,
    //   //     end_longitude: deliveryLng,
    //   //     ton,
    //   //     cbm,
    //   //   })
    //   } else if (country == 'US') {
    //     const usLtl = await usLtlTruckingCost({
    //       airportCode: pickup_location.port_code,
    //       zipcode: delivery_location.zipcode ?? '',
    //       kg,
    //     })
    //     if (!usLtl) {
    //       throw new Error('not found')
    //     }

    //     truckingCost.value = usLtl
    //   }
    // } else {
    //   throw new Error('invalid land mode')
    // }

    // const quoteTableData = generateQuoteTableData([truckingCost])

    // //COMMENT: appended additional fees
    // // appendAdditionalFees(quoteTableData)

    // const totalSum = quoteTableData.reduce(
    //   (acc, item) => {
    //     return {
    //       totalInrCost: acc.totalInrCost + item.total_amount,
    //       totalUsdCost: acc.totalUsdCost + item.cost_usd,
    //       subtotalInrCost: acc.subtotalInrCost + item.cost_inr,
    //       gstFiveInrTotal:
    //         item.gst_percentage == 5
    //           ? acc.gstFiveInrTotal + item.gst_amount
    //           : acc.gstFiveInrTotal,
    //       gstEighteenInrTotal:
    //         item.gst_percentage == 18
    //           ? acc.gstEighteenInrTotal + item.gst_amount
    //           : acc.gstEighteenInrTotal,
    //     }
    //   },
    //   {
    //     totalInrCost: 0,
    //     totalUsdCost: 0,
    //     subtotalInrCost: 0,
    //     gstFiveInrTotal: 0,
    //     gstEighteenInrTotal: 0,
    //   } // Initial values
    // )

    // //quote details
    // const { pointDetination, placeOfSupply, subject } =
    //   generateQuoteMetaDetails({
    //     ori_port_rail: {
    //       port_name: pickupLocationDescription,
    //     },
    //     des_port_rail: { port_name: delivery_location.description },
    //     firstSlug,
    //     icoterms,
    //   })
    // //send email

    // const quote_id = await createQuote({
    //   blok_quote_id: randomIdGenerator(),
    //   user_id: email,
    //   user_name,
    //   subject,
    //   quote_date: new Date(),
    //   user_company: company_name,
    //   place_of_supply: placeOfSupply,
    //   bill_to: pointDetination,
    //   total_inr: totalSum.totalInrCost,
    //   sub_total_inr_cost: totalSum.subtotalInrCost,
    //   gst_eighteen_inr_cost: totalSum.gstEighteenInrTotal,
    //   gst_five_inr_cost: totalSum.gstFiveInrTotal,
    //   total_usd: totalSum.totalUsdCost,
    //   line: 'All',
    //   line_quotation_number: '#' + new Date().getTime(),
    //   estimated_day: 0,
    //   valid_from: new Date().toLocaleDateString('en-CA'),
    //   valid_to: new Date(
    //     Date.now() + 30 * 24 * 60 * 60 * 1000
    //   ).toLocaleDateString('en-CA'),
    //   routing: [],
    //   form_data: validateData.data,
    //   data: quoteTableData,
    // })
    // await sendQuoteInfoToTeam({
    //   user_name,
    //   subject,
    //   total: totalSum.totalInrCost,
    //   quoteLink: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.quote.bloksupplychain.com'}/quote/${quote_id}`,
    //   company_name,
    //   phone_number: phone,
    //   email,
    // })
    return NextResponse.json(
      {
        quote_id:9999,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error: `no quote for this request. Please try again with another form input `,
        details: error,
      }
      // { status: 500 }
    )
  }
}
