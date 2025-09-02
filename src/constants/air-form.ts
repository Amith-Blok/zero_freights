import {
  EUROPE_COUNTRIES_OPTIONS,
  INDIAN_SUBCONTINENT_COUNTRIES_OPTIONS,
  NORTH_AMERICA_COUNTRIES_OPTIONS,
} from './coutries'

export const AIR_DEFAULT_VALUES = {
  ori_country: 'IN',
  des_country: 'US',
  pickup_check: false,
  delivery_check: false,
} as const

export const AIR_DESTINATION_COUNTRIES_OPTIONS = [
  ...NORTH_AMERICA_COUNTRIES_OPTIONS,
  ...EUROPE_COUNTRIES_OPTIONS,
]

export const AIR_ORIGIN_COUNTRIES_OPTIONS = [
  ...INDIAN_SUBCONTINENT_COUNTRIES_OPTIONS,
]
