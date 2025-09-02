import { AMERICA_OPTION } from './coutries'

export const LAND_DEFAULT_VALUES = {
  modes: 'SEAPORT_TRUCKING',
  pickup_location: undefined,
  hsn: undefined,
  incoterms: 'DDP',
  country: 'US',
  delivery_location: undefined,
} as const

export const LAND_AIRPORT_MODE_COUNTRIES_OPTIONS = [AMERICA_OPTION]
