import { currencyConverter } from '@/lib/exchange'
import { RateByContainerType } from '@/types/offers'

export const calculateTotalOfferCost = (
  containerRates: RateByContainerType[]
) => {
  return containerRates.reduce(
    (acc, rate) => {
      //INR
      acc.inr.d2 += currencyConverter({
        cost: rate.d2,
        sourceCurrency: rate.currency,
        targetCurrency: 'INR',
      })
      acc.inr.d4 += currencyConverter({
        cost: rate.d4,
        sourceCurrency: rate.currency,
        targetCurrency: 'INR',
      })
      acc.inr.d5 += currencyConverter({
        cost: rate.d5,
        sourceCurrency: rate.currency,
        targetCurrency: 'INR',
      })
      acc.inr.total += currencyConverter({
        cost: rate.total,
        sourceCurrency: rate.currency,
        targetCurrency: 'INR',
      })

      //USD
      acc.usd.d2 += currencyConverter({
        cost: rate.d2,
        sourceCurrency: rate.currency,
        targetCurrency: 'USD',
      })
      acc.usd.d4 += currencyConverter({
        cost: rate.d4,
        sourceCurrency: rate.currency,
        targetCurrency: 'USD',
      })
      acc.usd.d5 += currencyConverter({
        cost: rate.d5,
        sourceCurrency: rate.currency,
        targetCurrency: 'USD',
      })
      acc.usd.total += currencyConverter({
        cost: rate.total,
        sourceCurrency: rate.currency,
        targetCurrency: 'USD',
      })

      return acc
    },
    {
      inr: { d2: 0, d4: 0, d5: 0, total: 0 },
      usd: { d2: 0, d4: 0, d5: 0, total: 0 },
    }
  )
}
