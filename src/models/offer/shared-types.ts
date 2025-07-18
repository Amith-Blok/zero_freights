export type ContainerType = 'd2' | 'd4' | 'd5'
interface User {
  id: string
  name: string
  email: string
  company: string
  phone: string
}

export interface Exchange {
  usd_to_inr: number
  inr_to_usd: number
  eur_to_inr: number
  eur_to_usd: number
}

export type LocationType = 'port' | 'rail' | 'door' | 'warehouse' | 'air'
export interface Location {
  name: string
  code: string
  type: LocationType
}
export interface LabeledCost {
  label: string
  inr: number
  usd: number
}
export interface TotalCost {
  inr: number
  usd: number
}
export interface TotalCostByContainerType {
  inr: {
    d2: number
    d4: number
    d5: number
  }
  usd: {
    d2: number
    d4: number
    d5: number
  }
}
export interface ContainerCost {
  label: string
  currency: string
  additional_notes: string
  d2: number
  d4: number
  d5: number
}
export interface LineChargeData {
  line_name: string
  port_to_days: number
  estimated_days: number
  total_cost: TotalCostByContainerType
  valid_to: string
  data: ContainerCost
}

export type OfferModeTypes = 'WAR' | 'AIR' | 'LAND' | 'SEA_FCL' | 'SEA_LCL'

export enum ServiceType {
  SEA_FCL = 'Sea FCL',
  SEA_LCL = 'Sea LCL',
  AIR = 'Air',
  DOMESTIC_TRUCKING = 'Domestic Trucking',
  SEAPORT_TRUCKING = 'Seaport Trucking',
  AIRPORT_TRUCKING = 'Airport Trucking',
  FCL_WAR = 'FCL WH',
  LCL_WAR = 'LCL WH',
  LTL_WAR = 'LTL WH',
}

export interface Offer {
  form_id: string
  blok_id: string
  user: User
  subject: string
  place_of_supply: string
  bill_to: string
  //TODO: add enum for this
  mode: OfferModeTypes
  service_type: ServiceType
  start_code: string
  end_code: string
  exchanges: Exchange
  //TODO: add enum for this
  tags: string[]
  package_type: string
  locations: Location[]
}

export interface WarehouseOffer extends Offer {
  estimated_days: number
  carrier: string
  total_cost: TotalCost
  offers: LabeledCost[]
}

export interface AirOffer extends Offer {
  carrier: string
  total_cost: TotalCost
  offers: LabeledCost[]
}

export interface LandOffer extends Offer {
  carrier: string
  total_cost: TotalCost
  offers: LabeledCost[]
}

export interface SeaLclOffer extends Offer {
  carrier: string
  total_cost: TotalCost
  offers: LabeledCost[]
}

export interface SeaFclOffer extends Offer {
  //TODO: remove this later and replace it with package_type
  container_type: string
  offers: {
    line_charges: LineChargeData[]
    local_charges: ContainerCost[]
  }
}
