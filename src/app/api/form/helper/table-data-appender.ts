// import { INR_TO_USD, USD_TO_INR } from '@/constants'
import { US_ALL_ADDITIONAL_FEES } from '@/constants/us-custom'
import { RateByContainerType } from '@/models/offers'

//COMMENT: append additional fees to the data array
// export const appendAdditionalFees = (data: DataType[]) => {
//   US_ALL_ADDITIONAL_FEES.forEach((fee) => {
//     const cost = fee.value
//     const cost_usd = fee.currency === 'USD' ? cost : cost * INR_TO_USD
//     const gst_percentage = 18
//     const cost_inr = fee.currency === 'INR' ? cost : cost * USD_TO_INR
//     const gst_amount = (cost_inr * gst_percentage) / 100
//     const total_amount = cost_inr + gst_amount
//     data.push({
//       label: fee.name,
//       code: fee.code,
//       category: 'additional_fee',
//       cost_usd: cost_usd,
//       cost_inr: cost_inr,
//       gst_percentage: gst_percentage,
//       gst_amount: gst_amount,
//       total_amount: total_amount,
//     })
//   })
// }

//COMMENT: append additional fees to the data array
export const appendAdditionalFees = (data: RateByContainerType[]) => {
  US_ALL_ADDITIONAL_FEES.forEach((fee) => {
    data.push({
      label: fee.name,
      currency: fee.currency,
      additional_notes: 'Blok Custom additions',
      d2: fee.value,
      d4: fee.value,
      d5: fee.value,
    })
  })
}
