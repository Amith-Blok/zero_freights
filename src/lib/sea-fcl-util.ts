import { ContainerCost, LabeledCost } from '@/models/offer/shared-types'
import { currencyConverter } from './exchange'

const getTotalCost = (charges: LabeledCost[]) => {
  return charges.reduce((acc, charge) => {
    return (acc += charge.inr)
  }, 0)
}
const getSeaFclCharges = (
  charges: ContainerCost[],
  localCharges: {
    label: string
    d2: number
    d4: number
    d5: number
    total: number
  }[],
  currency: 'INR' | 'USD'
) => {
  const lineCharges = charges.map((rate) => ({
    label: rate.label,
    d2: currencyConverter({
      cost: rate.d2,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    d4: currencyConverter({
      cost: rate.d4,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    d5: currencyConverter({
      cost: rate.d5,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
    total: currencyConverter({
      cost: rate.total,
      sourceCurrency: rate.currency as any,
      targetCurrency: currency,
    }),
  }))
  return [...lineCharges, ...localCharges]
}

const getTotalSeaFclCostAndCharges = (
  charges: ContainerCost[],
  localCharges: ContainerCost[],
  currency: 'INR' | 'USD'
) => {
  const filteredLocalCharges = localCharges.map((charge) => ({
    label: charge.label,
    d2: currencyConverter({
      cost: charge.d2,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    d4: currencyConverter({
      cost: charge.d4,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    d5: currencyConverter({
      cost: charge.d5,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
    total: currencyConverter({
      cost: charge.total,
      sourceCurrency: charge.currency as any,
      targetCurrency: currency,
    }),
  }))
  const totalCharges = getSeaFclCharges(charges, filteredLocalCharges, currency)
  // const totalCost = getTotalCost(totalCharges)
  return { totalCharges }
}
export { getTotalCost, getSeaFclCharges, getTotalSeaFclCostAndCharges }
