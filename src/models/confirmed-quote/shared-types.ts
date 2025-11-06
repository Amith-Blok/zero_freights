import {
  ContainerDetailsType,
  ContainerCost,
  LabeledCost,
  Location,
  ServiceType,
  TotalCost,
  Exchange,
  IgContainerCost,
  IgContainerDetailsType,
  TotalCostByContainerType,
} from '../offer/shared-types'

export interface _LineChargeData {
  data: ContainerCost
}
export type ConfirmedQuoteModeTypes =
  | 'CONFIRMED_WAR'
  | 'CONFIRMED_AIR'
  | 'CONFIRMED_LAND'
  | 'CONFIRMED_SEA_LCL'
  | 'CONFIRMED_SEA_FCL'
  | 'CONFIRMED_SEA_DG'
  | 'CONFIRMED_SEA_RF'
  | 'CONFIRMED_SEA_IG'
  | 'CONFIRMED_SEA_OOG'
export interface ConfirmedQuote {
  form_id: string
  blok_id: string
  offer_id: string
  offer_date: string
  user_id: string
  subject: string
  place_of_supply: string
  bill_to: string
  mode: ConfirmedQuoteModeTypes
  service_type: ServiceType
  start_code: string
  end_code: string
  exchanges: Exchange
  locations: Location[]
  tags: string[]
}

export interface WarehouseConfirmedQuote extends ConfirmedQuote {
  carrier: string
  package_type: string
  transit_days: number
  total_cost: TotalCost
  data: LabeledCost[]
}
export interface AirConfirmedQuote extends ConfirmedQuote {
  carrier: string
  package_type: string
  transit_days: number
  total_cost: TotalCost
  data: LabeledCost[]
}
export interface LandConfirmedQuote extends ConfirmedQuote {
  carrier: string
  package_type: string
  total_cost: TotalCost
  data: LabeledCost[]
}
export interface SeaLclConfirmedQuote extends ConfirmedQuote {
  carrier: string
  package_type: string
  total_cost: TotalCost
  data: LabeledCost[]
}
export interface SeaFclConfirmedQuote extends ConfirmedQuote {
  carrier: string
  port_to_days: number
  estimated_days: number
  valid_to: string
  container_types: string[]
  container_details: ContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  total_cost: TotalCostByContainerType
  data: ContainerCost[]
}
export interface SeaDgConfirmedQuote extends ConfirmedQuote {
  carrier: string
  port_to_days: number
  estimated_days: number
  valid_to: string
  container_types: string[]
  container_details: ContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  dg_class: string
  total_cost: TotalCostByContainerType
  data: ContainerCost[]
}
export interface SeaRfConfirmedQuote extends ConfirmedQuote {
  carrier: string
  port_to_days: number
  estimated_days: number
  valid_to: string
  container_types: string[]
  container_details: ContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  temperature: number
  humidity: number
  total_cost: TotalCostByContainerType
  data: ContainerCost[]
}
export interface SeaIgConfirmedQuote extends ConfirmedQuote {
  carrier: string
  port_to_days: number
  estimated_days: number
  valid_to: string
  container_types: string[]
  container_details: IgContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  total_cost: TotalCostByContainerType
  data: IgContainerCost[]
}
export interface SeaOogConfirmedQuote extends ConfirmedQuote {
  carrier: string
  port_to_days: number
  estimated_days: number
  valid_to: string
  container_types: string[]
  container_details: IgContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  total_cost: TotalCostByContainerType
  data: IgContainerCost[]
}
