import {
  EUROPE_COUNTRIES_OPTIONS,
  NORTH_AMERICA_COUNTRIES_OPTIONS,
} from './coutries'

export const WAREHOUSE_DEFAULT = {
  modes: 'FCL_WAREHOUSE',
  is_google_location: undefined,
  hsn: undefined,
  incoterms: 'DDP',
  country: 'US',
  pickup_location: undefined,
  delivery_location: undefined,
  fcl_load: [
    {
      fcl_wid: undefined,
      fcl_hgt: undefined,
      fcl_lgt: undefined,
      fcl_volume_unit: 'CM',
      fcl_quantity: undefined,
      fcl_weight: undefined,
      fcl_weight_unit: 'KG',
    },
  ],
} as const

export const WAREHOUSE_COUNTRIES_OPTION = [
  ...NORTH_AMERICA_COUNTRIES_OPTIONS,
  ...EUROPE_COUNTRIES_OPTIONS,
]

export const WAREHOUSE_CHARGE_USD = 650
