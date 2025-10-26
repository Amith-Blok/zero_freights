import { currencyConverter } from '@/lib/exchange'
import { IgContainerCost } from '@/models/offer/shared-types'
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

export const calculateIgTotalOfferCost = (
  containerRates: IgContainerCost[]
) => {
  return containerRates.reduce(
    (acc, rate) => {
      acc.inr.fr2 += currencyConverter({
        cost: rate.fr2,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'INR',
      })
      acc.inr.fr4 += currencyConverter({
        cost: rate.fr4 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'INR',
      })
      acc.inr.fr5 += currencyConverter({
        cost: rate.fr5 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'INR',
      })
      acc.inr.total += currencyConverter({
        cost: rate.total,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'INR',
      })
      acc.usd.fr2 += currencyConverter({
        cost: rate.fr2 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'INR',
      })
      acc.usd.fr4 += currencyConverter({
        cost: rate.fr4 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'INR',
      })
      acc.usd.ot2 += currencyConverter({
        cost: rate.ot2 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'USD',
      })
      acc.usd.ot4 += currencyConverter({
        cost: rate.ot4 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'USD',
      })
      acc.usd.fr2 += currencyConverter({
        cost: rate.fr2 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'USD',
      })
      acc.usd.fr4 += currencyConverter({
        cost: rate.fr4 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'USD',
      })
      acc.usd.fr5 += currencyConverter({
        cost: rate.fr5 || 0,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'USD',
      })
      acc.usd.total += currencyConverter({
        cost: rate.total,
        sourceCurrency: rate.currency as 'USD' | 'INR' | 'EUR',
        targetCurrency: 'USD',
      })
      return acc
    },
    {
      inr: { ot2: 0, ot4: 0, fr2: 0, fr4: 0, fr5: 0, total: 0 },
      usd: { ot2: 0, ot4: 0, fr2: 0, fr4: 0, fr5: 0, total: 0 },
    }
  )
}
