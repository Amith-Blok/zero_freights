import { FIVE_PERCENTAGE_GST_CODE_LIST } from '@/constants'
import { USD_TO_INR } from '@/constants/exchange-value'
import { INR_TO_USD } from '@/constants/exchange-value'
import { getNextSequence } from '@/data/counter'
import { ConfimredQuoteDataType } from '@/models/confirmed-quote'
import { CounterEnum } from '@/models/counter'
import { RateInfoType } from '@/types/common'
import { QuoteFormProcessedData } from '@/types/global'
import { DataType } from '@/types/quotes'

export function generateQuoteMetaDetails({
  pickup_location,
  ori_port_rail,
  des_port_rail,
  delivery_location,
  shipline = '',
  firstSlug,
  incoterms,
}: {
  pickup_location?: { description: string }
  ori_port_rail: { port_name: string }
  des_port_rail: { port_name: string }
  delivery_location?: { description: string }
  shipline?: string
  firstSlug: string
  incoterms: string
}) {
  const pointOrigin = pickup_location
    ? pickup_location?.description + ` Via ${ori_port_rail.port_name}`
    : ori_port_rail.port_name

  const pointDetination = delivery_location
    ? delivery_location.description + ` Via ${des_port_rail.port_name}`
    : des_port_rail.port_name
  const placeOfSupply = ori_port_rail.port_name
  const subject = `${firstSlug} FROM ${pointOrigin}  To ${pointDetination} ${shipline ? `- ${shipline} (${incoterms})` : ''} `
  return { pointDetination, placeOfSupply, subject }
}
export function generateQuoteTableData(
  formData: QuoteFormProcessedData[]
): DataType[] {
  let data = []
  for (let fdata of formData) {
    const cost = fdata.value
    if (cost == 0) {
      continue
    }
    const costUsd = fdata.currency == 'USD' ? cost : cost * INR_TO_USD
    const costInr = fdata.currency == 'USD' ? cost * USD_TO_INR : cost
    const gstPercentage = FIVE_PERCENTAGE_GST_CODE_LIST.includes(fdata.code)
      ? 5
      : 18
    const gstAmount = (costInr * gstPercentage) / 100
    const totalAmount = costInr + gstAmount
    data.push({
      label: fdata.name,
      code: fdata.code,
      category: fdata.name.toUpperCase().replaceAll(' ', '_'),
      cost_usd: costUsd,
      cost_inr: costInr,
      gst_percentage: gstPercentage,
      gst_amount: gstAmount,
      total_amount: totalAmount,
    })
  }
  return data
}
export function formateRateInfoToConfirmQuoteData(
  formData: RateInfoType[]
): ConfimredQuoteDataType[] {
  let records = []
  for (let data of formData) {
    const cost = data.value
    if (cost == 0) {
      continue
    }
    const costUsd = data.currency == 'USD' ? cost : cost * INR_TO_USD
    const costInr = data.currency == 'USD' ? cost * USD_TO_INR : cost
    records.push({
      label: data.name,
      usd: costUsd,
      inr: costInr,
    })
  }
  return records
}
export async function generateOfferId(
  sequenceName: CounterEnum = CounterEnum.offer
) {
  const count = await getNextSequence(sequenceName)
  return 'ZFBSCO' + count.padStart(6, '0')
}
export async function generateConfirmedQuoteId(
  sequenceName: CounterEnum = CounterEnum.quote
) {
  const count = await getNextSequence(sequenceName)
  return 'ZFBSCQ' + count.padStart(6, '0')
}
