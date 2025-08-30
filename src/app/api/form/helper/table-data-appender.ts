// import { INR_TO_USD, USD_TO_INR } from '@/constants'
import { INR_TO_USD, USD_TO_INR } from '@/constants'
import {
  US_AIR_ADDITIONAL_FEES,
  US_ALL_ADDITIONAL_FEES,
} from '@/constants/us-custom'
import {
  ContainerCost,
  LabeledCost,
  OfferModeTypes,
} from '@/models/offer/shared-types'
import { IncotermsType } from '@/schema/sea-schema'

const EXCLUDE_FEES_DAP_LIST = ['ISF', 'CUSTOMS_FEE']
//COMMENT: append additional fees to the data array
export const appendSeaFclAdditionalFees = (
  data: ContainerCost[],
  incoterms: IncotermsType
) => {
  if (incoterms === 'FOB' || incoterms === 'CIF') {
    return
  }
  US_ALL_ADDITIONAL_FEES.forEach((fee) => {
    if (incoterms === 'DAP' && EXCLUDE_FEES_DAP_LIST.includes(fee.code)) {
      console.log('DAP', fee.code)
      return
    }
    data.push({
      label: fee.name,
      currency: fee.currency,
      additional_notes: 'Blok Custom additions',
      d2: fee.value,
      d4: fee.value,
      d5: fee.value,
      total: fee.value,
    })
  })
}
export const newAppendAdditionalFees = ({
  data,
  incoterms,
  mode,
  removeList,
}: {
  data: LabeledCost[]
  incoterms: IncotermsType
  mode?: OfferModeTypes
  removeList?: string[]
}) => {
  const additionalFees =
    mode === 'AIR' ? US_AIR_ADDITIONAL_FEES : US_ALL_ADDITIONAL_FEES
  additionalFees.forEach((fee) => {
    if (incoterms === 'DAP' && EXCLUDE_FEES_DAP_LIST.includes(fee.code)) {
      return
    }
    if (removeList?.includes(fee.code)) {
      return
    }
    const cost = fee.value
    const costUsd = fee.currency == 'USD' ? cost : cost * INR_TO_USD
    const costInr = fee.currency == 'USD' ? cost * USD_TO_INR : cost
    data.push({
      label: fee.name,
      inr: costInr,
      usd: costUsd,
    })
  })
}
