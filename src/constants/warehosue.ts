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
