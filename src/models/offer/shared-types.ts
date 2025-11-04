export type ContainerType = 'd2' | 'd4' | 'd5'
export type STDContainerType = '20STD' | '40STD' | '40HC'

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
export interface ContainerDetailsType {
  d2?: { quantity: number; weight: number } | null
  d4?: { quantity: number; weight: number } | null
  d5?: { quantity: number; weight: number } | null
}
export interface IgContainerDetailsType {
  ot2?: { quantity: number; weight: number } | null
  ot4?: { quantity: number; weight: number } | null
  fr2?: { quantity: number; weight: number } | null
  fr4?: { quantity: number; weight: number } | null
  fr5?: { quantity: number; weight: number } | null
}
export interface TotalCostByContainerType {
  freight_cost: {
    inr: {
      d2: number
      d4: number
      d5: number
      total: number
    }
    usd: {
      d2: number
      d4: number
      d5: number
      total: number
    }
  }
  local_cost: {
    inr: {
      d2: number
      d4: number
      d5: number
      total: number
    }
    usd: {
      d2: number
      d4: number
      d5: number
      total: number
    }
  }
  //NOTE: total cost= freight cost + local cost
  total_cost: {
    inr: {
      d2: number
      d4: number
      d5: number
      total: number
    }
    usd: {
      d2: number
      d4: number
      d5: number
      total: number
    }
  }
}
export interface TotatCostByIgContainerType {
  freight_cost: {
    inr: {
      ot2: number
      ot4: number
      fr2: number
      fr4: number
      fr5: number
      total: number
    }
    usd: {
      ot2: number
      ot4: number
      fr2: number
      fr4: number
      fr5: number
      total: number
    }
  }
  local_cost: {
    inr: {
      ot2: number
      ot4: number
      fr2: number
      fr4: number
      fr5: number
      total: number
    }
    usd: {
      ot2: number
      ot4: number
      fr2: number
      fr4: number
      fr5: number
      total: number
    }
  }
  //NOTE: total cost= freight cost + local cost
  total_cost: {
    inr: {
      ot2: number
      ot4: number
      fr2: number
      fr4: number
      fr5: number
      total: number
    }
    usd: {
      ot2: number
      ot4: number
      fr2: number
      fr4: number
      fr5: number
      total: number
    }
  }
}
export interface ContainerCost {
  label: string
  currency: string
  additional_notes?: string
  d2: number
  d4: number
  d5: number
  total: number
}
export interface IgContainerCost {
  label: string
  currency: string
  additional_notes?: string
  ot2: number
  ot4: number
  fr2: number
  fr4: number
  fr5: number
  total: number
}
export interface LineChargeData {
  line_name: string
  port_to_days: number
  estimated_days: number
  tags: string[]
  cost_breakdown: TotalCostByContainerType
  valid_to: string
  data: ContainerCost
}
export interface IgLineChargeData {
  line_name: string
  port_to_days: number
  estimated_days: number
  tags: string[]
  cost_breakdown: TotatCostByIgContainerType
  valid_to: string
  data: IgContainerCost
}

export type OfferModeTypes =
  | 'WAR'
  | 'AIR'
  | 'LAND'
  | 'SEA_FCL'
  | 'SEA_LCL'
  | 'SEA_DG'
  | 'SEA_RF'
  | 'SEA_IG'
  | 'SEA_OOG'

export enum ServiceType {
  SEA_FCL = 'SEA FCL',
  SEA_LCL = 'SEA LCL',
  SEA_DG = 'SEA DG',
  SEA_RF = 'SEA RF',
  SEA_IG = 'SEA IG',
  SEA_OOG = 'SEA OOG',
  AIR = 'AIR',
  DOMESTIC_TRUCKING = 'DOMESTIC TRUCKING',
  SEAPORT_TRUCKING = 'SEAPORT TRUCKING',
  AIRPORT_TRUCKING = 'AIRPORT TRUCKING',
  FCL_WAR = 'FCL WAR',
  LCL_WAR = 'LCL WAR',
  LTL_WAR = 'LTL WAR',
}
export interface Offer {
  form_id: string
  blok_id: string
  user_id: string
  subject: string
  place_of_supply: string
  bill_to: string
  mode: OfferModeTypes
  service_type: ServiceType
  start_code: string
  end_code: string
  exchanges: Exchange
  tags: string[]
  locations: Location[]
  created_at?: Date
}
export interface WarehouseOffer extends Offer {
  estimated_days: number
  carrier: string
  package_type: string
  total_cost: TotalCost
  offers: LabeledCost[]
}
export interface AirOffer extends Offer {
  estimated_days: number
  carrier: string
  package_type: string
  total_cost: TotalCost
  offers: LabeledCost[]
}
export interface LandOffer extends Offer {
  carrier: string
  package_type: string
  total_cost: TotalCost
  offers: LabeledCost[]
}
export interface SeaLclOffer extends Offer {
  carrier: string
  package_type: string
  total_cost: TotalCost
  offers: LabeledCost[]
}
export interface SeaFclOffer extends Offer {
  container_types: string[]
  container_details: ContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  offers: {
    line_charges: LineChargeData[]
    local_charges: ContainerCost[]
  }
}
export interface SeaDgOffer extends Offer {
  container_types: string[]
  container_details: ContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  dg_class: string
  offers: {
    line_charges: LineChargeData[]
    local_charges: ContainerCost[]
  }
}
export interface SeaRfOffer extends Offer {
  container_types: string[]
  container_details: ContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  temperature: number
  humidity: number
  offers: {
    line_charges: LineChargeData[]
    local_charges: ContainerCost[]
  }
}
export interface SeaIgOffer extends Offer {
  container_types: string[]
  container_details: IgContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  offers: {
    line_charges: IgLineChargeData[]
    local_charges: IgContainerCost[]
  }
}
export interface SeaOogOffer extends Offer {
  container_types: string[]
  container_details: IgContainerDetailsType
  weight_unit: 'KG' | 'LBS'
  offers: {
    line_charges: IgLineChargeData[]
    local_charges: IgContainerCost[]
  }
}
