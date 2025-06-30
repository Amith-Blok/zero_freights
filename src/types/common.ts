export type AllCurrenciesType = 'USD' | 'INR' | 'EUR'
export type RateInfoType = {
  name: string
  code: string
  currency: AllCurrenciesType
  value: number
}
