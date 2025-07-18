import {
  ContainerCost,
  ContainerType,
  LabeledCost,
} from '@/models/offer/shared-types'
import { currencyConverter } from './exchange'

const getTotalCost = (charges: LabeledCost[]) => {
  return charges.reduce((acc, charge) => {
    return (acc += charge.inr)
  }, 0)
}
const getSeaFclCharges = (
  charges: ContainerCost[],
  containerType: ContainerType,
  localCharges: LabeledCost[]
) => {
  const lineCharges = charges.map((rate) => ({
    label: rate.label,
    inr: currencyConverter({
      cost: rate[containerType],
      sourceCurrency: rate.currency as any,
      targetCurrency: 'INR',
    }),
    usd: currencyConverter({
      cost: rate[containerType],
      sourceCurrency: rate.currency as any,
      targetCurrency: 'USD',
    }),
  }))
  return [...lineCharges, ...localCharges]
}

const getTotalSeaFclCostAndCharges = (
  charges: ContainerCost[],
  containerType: ContainerType,
  localCharges: ContainerCost[]
) => {
  const filteredLocalCharges = localCharges.map((charge) => ({
    label: charge.label,
    inr: currencyConverter({
      cost: charge[containerType],
      sourceCurrency: charge.currency as any,
      targetCurrency: 'INR',
    }),
    usd: currencyConverter({
      cost: charge[containerType],
      sourceCurrency: charge.currency as any,
      targetCurrency: 'USD',
    }),
  }))
  const totalCharges = getSeaFclCharges(
    charges,
    containerType,
    filteredLocalCharges
  )
  const totalCost = getTotalCost(totalCharges)
  return { totalCost, totalCharges }
}
export { getTotalCost, getSeaFclCharges, getTotalSeaFclCostAndCharges }
