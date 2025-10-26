import { IgContainerCost, LabeledCost } from '@/models/offer/shared-types'
import { currencyConverter } from './exchange'

const getTotalCost = (charges: LabeledCost[]) => {
  return charges.reduce((acc, charge) => {
    return (acc += charge.inr)
  }, 0)
}
const getSeaGaugeCharges = (
  charges: IgContainerCost[],
  localCharges: {
    label: string
    currency: 'INR' | 'USD'
    ot2: number
    ot4: number
    fr2: number
    fr4: number
    fr5: number
    total: number
  }[],
  currency: 'INR' | 'USD'
) => {
  const lineCharges = charges.map((rate) => ({
    label: rate.label,
    currency: rate.currency as 'INR' | 'USD',
    ot2: currencyConverter({
      cost: rate.ot2,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    ot4: currencyConverter({
      cost: rate.ot4,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    fr2: currencyConverter({
      cost: rate.fr2,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    fr4: currencyConverter({
      cost: rate.fr4,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    fr5: currencyConverter({
      cost: rate.fr5,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    total: currencyConverter({
      cost: rate.ot2 + rate.ot4 + rate.fr2 + rate.fr4 + rate.fr5,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
  }))
  return [...lineCharges, ...localCharges]
}

const getTotalSeaGaugeCostAndCharges = (
  charges: IgContainerCost[],
  localCharges: IgContainerCost[],
  currency: 'INR' | 'USD'
) => {
  const filteredLocalCharges = localCharges.map((charge) => ({
    label: charge.label,
    currency: charge.currency as 'INR' | 'USD',
    ot2: currencyConverter({
      cost: charge.ot2,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    ot4: currencyConverter({
      cost: charge.ot4,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    fr2: currencyConverter({
      cost: charge.fr2,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    fr4: currencyConverter({
      cost: charge.fr4,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    fr5: currencyConverter({
      cost: charge.fr5,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    total: currencyConverter({
      cost: charge.ot2 + charge.ot4 + charge.fr2 + charge.fr4 + charge.fr5,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
  }))
  const totalCharges = getSeaGaugeCharges(
    charges,
    filteredLocalCharges,
    currency
  )
  // const totalCost = getTotalCost(totalCharges)
  return { totalCharges }
}
export { getTotalCost, getSeaGaugeCharges, getTotalSeaGaugeCostAndCharges }
