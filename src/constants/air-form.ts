export const AIR_DEFAULT_VALUES = {
  ori_country: 'IN',
  des_country: 'US',
  pickup_check: false,
  delivery_check: false,
} as const

export const AIR_DESTINATION_COUNTRIES_OPTION = [
  { value: 'US', label: 'US' },
  { value: 'CA', label: 'CA' },
  { value: 'EU', label: 'EU' },
]
