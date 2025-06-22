import { USD_TO_INR } from '@/constants'
import { EUR_TO_INR, EUR_TO_USD, INR_TO_USD } from '@/constants/exchange-value'
// import { RateByContainerType } from "@/types/offers";

const INR_MAPPER = {
  USD: USD_TO_INR,
  EUR: EUR_TO_INR,
  INR: 1,
}
const USD_MAPPER = {
  INR: INR_TO_USD,
  EUR: EUR_TO_USD,
  USD: 1,
}

export const currencyConverter = ({
  cost,
  sourceCurrency,
  targetCurrency,
}: {
  cost: number
  sourceCurrency: 'USD' | 'INR' | 'EUR'
  targetCurrency: 'USD' | 'INR'
}) => {
  if (targetCurrency == 'INR') {
    return cost * INR_MAPPER[sourceCurrency]
  }
  return cost * USD_MAPPER[sourceCurrency]
}

export const exchangeValues = () => {
  return {
    inr_to_usd: INR_TO_USD,
    usd_to_inr: USD_TO_INR,
    eur_to_inr: EUR_TO_INR,
    eur_to_usd: EUR_TO_USD,
  }
}
