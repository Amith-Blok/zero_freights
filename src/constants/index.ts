import { INR_TO_USD, USD_TO_INR } from './exchange-value'
import { HEADER_ROUTES } from './site-map'
export { USD_TO_INR, INR_TO_USD, HEADER_ROUTES }
export const SEA_MODES = [
  { label: 'Full container load(FCL)', value: 'FCL' },
  { label: 'Less container load(LCL)', value: 'LCL' },
  { label: 'Bulk', value: 'BULK', disable: true },
]
export const LAND_MODES = [
  { label: 'Seaport Trucking', value: 'SEAPORT_TRUCKING' },
  { label: 'Domestic Trucking', value: 'DOMESTIC_TRUCKING' },
  { label: 'Airport Trucking', value: 'AIRPORT_TRUCKING' },
]
export const WAREHOUSE_MODES = [
  { label: 'Full Container Load(FCL)', value: 'FCL_WAREHOUSE' },
  { label: 'Less Container Load(LCL)', value: 'LCL_WAREHOUSE' },
  { label: 'Less than Truckload(LTL)', value: 'LTL_WAREHOUSE' },
]
export const COUNTRIES_LIST = [
  { value: 'IN', label: 'IND' },
  { value: 'US', label: 'US' },
  { value: 'EU', label: 'EU', disable: true },
  { value: 'CA', label: 'CA', disable: true },
]
export const COUNTRIES_LAND_LIST = [
  { value: 'US', label: 'US' },
  { value: 'EU', label: 'EU' },
  { value: 'CA', label: 'CA' },
]
export const COUNTRIES_SEA_FCL_LCL_LIST = [
  { value: 'IN', label: 'IND' },
  { value: 'US', label: 'US' },
  { value: 'CA', label: 'CA' },
  { value: 'EU', label: 'EU' },
  { value: 'TR', label: 'TR' },
]

export const COUNTRIES_LIST_WAREHOUSE = [
  { value: 'IN', label: 'IND', disable: true },
  { value: 'US', label: 'US' },
]
export const COUNTRIES = ['IN', 'US', 'CA', 'EU', 'TR'] as const

export const BULK_TYPE_LIST = [
  { value: 'GC', label: 'General Cargo(GC)' },
  { value: 'RC', label: 'Reefer Cargo(RC)' },
  { value: 'DG', label: 'Dangerous Cargo(DG)' },
  { value: 'OOG', label: 'Out of gauge Cargo(OOG)' },
  { value: 'BC', label: 'Bulk Container' },
  { value: 'C', label: 'Containership' },
  { value: 'P/AC', label: 'Product tankers/Asphalt carrier' },
  { value: 'P/CT', label: 'Product tankers/Chemical tankers' },
  { value: 'P/CC', label: 'Product tankers/Crude carrier' },
  { value: 'P/GC', label: 'Product tankers/Gas Carriers' },
  { value: 'S/HL', label: 'Specialized/Hevy-lift' },
  { value: 'S/L', label: 'Specialized/Livestock' },
  { value: 'S/R', label: 'Specialized/Refrigerated' },
  { value: 'S/Ro', label: 'Specialized/Ro/Ro' },
  { value: 'S/WC', label: 'Specialized/Wood chip' },
]
export const BULK_TYPE = [
  'GC',
  'RC',
  'DG',
  'OOG',
  'BC',
  'C',
  'P/AC',
  'P/CT',
  'P/CC',
  'P/GC',
  'S/HL',
  'S/L',
  'S/R',
  'S/Ro',
  'S/WC',
] as const

export const LCL_PACKAGE_TYPE_LIST = [
  { value: 'pallete', label: 'Pallete' },
  { value: 'boxes', label: 'Boxes/Crates' },
  { value: 'package', label: 'Packages' },
  { value: 'bag', label: 'Bags' },
]
export const LCL_PACKAGE_TYPE = ['pallete', 'boxes', 'package', 'bag'] as const

export const FCL_CONTAINER_TYPE_LIST = [
  { value: '20DV', label: "20' Standard" },
  { value: '40DV', label: "40' Standard" },
  { value: '40HC', label: "40' High cube" },
]

export const SEA_DEFAULT_VALUES = {
  modes: 'FCL',
  pickup_location: undefined,
  delivery_location: undefined,
  hsn: undefined,
  icoterms: 'DDP',
  ori_country: 'IN',
  des_country: 'US',
  pickup_check: false,
  delivery_check: false,
  origin_port: undefined,
  destination_port: undefined,
} as const

//SEA FORM
export const KG_LBS = ['KG', 'LBS'] as const
export const IN_CM = ['CM', 'IN'] as const
export const KG_LBS_DAY = ['kg/day', 'lbs/day'] as const
export const TRUCKING_TYPE = ['FAC', 'CFS'] as const
export const FCL_CONTAINER_TYPE = ['20DV', '40DV', '40HC'] as const
export const ICOTERMS = ['DAP', 'DDP', 'DDU'] as const

//Regex for phone validation
export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

export const EUROPEAN_UNION_COUNTREIS_ISO = [
  'NL', // Netherlands
  'BE', // Belgium
  'DE', // Germany
  'ES', // Spain
  'IT', // Italy
  'GB', // United Kingdom
  'GR', // Greece
  'IE', // Ireland
  'PL', // Poland
  'RO', // Romania
  'SE', // Sweden
  'LV', // Latvia
  'BG', // Bulgaria
  'FR', // France
  'DK', // Denmark
  'LT', // Lithuania
  'LU', //Luxemburg
  'SI', // Slovenia
  'NO', // Norway
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'MT', // Malta
  'HU', // Hungary
  'EE', // Estonia
  'FI', // Finland
  'PT', // Portugal
]

export const FIVE_PERCENTAGE_GST_CODE_LIST = [
  'SEA',
  'BLOK_AIR_FREIGHT',
  'BLOK_SEA_LCL_FREIGHT',
]
