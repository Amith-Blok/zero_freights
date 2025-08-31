export type LocationType = {
  code?: string
  name: string
  type?: 'door' | 'port' | 'rail'
}
export type ExchangeType = {
  usd_to_inr: number
  inr_to_usd: number
  eur_to_inr: number
  eur_to_usd: number
}
export type RateByContainerType = {
  label: string
  currency: 'USD' | 'INR' | 'EUR'
  additional_notes?: string
  d2: number
  d4: number
  d5: number
  total: number
}

export type MultiCurrencyCostType = {
  inr: {
    d1: number
    d2: number
    d3: number
  }
  usd: {
    d1: number
    d2: number
    d3: number
  }
}
export type SeaFreightType = {
  line_name: string
  estimated_days: number
  port_to_days: number
  total_cost: MultiCurrencyCostType
  valid_to: string
  data: RateByContainerType[]
}

export type OfferDataType = {
  sea_freights: SeaFreightType[]
  local_charges: RateByContainerType[]
}

export type OfferType = {
  offer_id: string
  form_id: string
  user_id: string
  user_name: string
  user_company: string
  subject: string
  place_of_supply: string
  bill_to: string
  start_code: string
  end_code: string
  container_type: string
  tags: 'door_to_door' | 'door_to_port' | 'port_to_door' | 'port_to_port'
  locations: LocationType[]
  exchanges: ExchangeType
  tag: string
  offers: OfferDataType
  created_at: Date
}
