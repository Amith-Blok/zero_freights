export type AllCurrenciesType = 'USD' | 'INR' | 'EUR'
export type RateInfoType = {
  name: string
  code: string
  currency: AllCurrenciesType
  value: number
}

export enum PdfType {
  OFFER = 'OFFER',
  CONFIRMED_QUOTE = 'CONFIRMED_QUOTE',
}

export type Country = {
  code: string
  name: string
}
