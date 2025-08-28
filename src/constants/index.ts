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
  { value: '20STD', label: '20 STD' },
  { value: '40STD', label: '40 STD' },
  { value: '40HC', label: '40 HC' },
]

export const SEA_DEFAULT_VALUES = {
  modes: 'FCL' as const,
  fcl_container_type: ['20STD', '40STD', '40HC'] as (
    | '20STD'
    | '40STD'
    | '40HC'
  )[],
  fcl_quantities: { '20STD': 1, '40STD': 1, '40HC': 1 },
  fcl_weights: { '20STD': 24000, '40STD': 26700, '40HC': 29500 },
  fcl_unit: 'KG' as const,
  pickup_location: undefined,
  delivery_location: undefined,
  hsn: undefined,
  incoterms: 'DDP' as const,
  ori_country: 'IN' as const,
  des_country: 'US' as const,
  pickup_check: false,
  delivery_check: false,
  origin_port: undefined,
  destination_port: undefined,
}

//SEA FORM
export const KG_LBS = ['KG', 'LBS'] as const
export const IN_CM = ['CM', 'IN'] as const
export const KG_LBS_DAY = ['kg/day', 'lbs/day'] as const
export const TRUCKING_TYPE = ['FAC', 'CFS'] as const

//NOTE: I change this from DV to STD
export const FCL_CONTAINER_TYPE = ['20STD', '40STD', '40HC'] as const
export const incoterms = ['DAP', 'DDP', 'DDU', 'FOB', 'CIF'] as const

//Regex for phone validation
export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

export const FIVE_PERCENTAGE_GST_CODE_LIST = [
  'SEA',
  'BLOK_AIR_FREIGHT',
  'BLOK_SEA_LCL_FREIGHT',
]

export const ALL_COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'AU', name: 'Australia' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'DE', name: 'Germany' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ES', name: 'Spain' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'GR', name: 'Greece' },
  { code: 'HR', name: 'Croatia' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IN', name: 'India' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'OM', name: 'Oman' },
  { code: 'PL', name: 'Poland' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'US', name: 'United States' },
]

export const ALL_COUNTRY_CODES = [
  'AE',
  'AU',
  'BE',
  'BH',
  'CA',
  'CN',
  'HK',
  'DE',
  'DK',
  'EE',
  'ES',
  'FR',
  'GB',
  'GR',
  'HR',
  'IE',
  'IN',
  'IT',
  'JP',
  'KE',
  'KH',
  'KW',
  'LT',
  'MM',
  'MY',
  'MZ',
  'NL',
  'NO',
  'NZ',
  'OM',
  'PL',
  'QA',
  'RO',
  'SA',
  'SE',
  'SG',
  'SI',
  'TZ',
  'US',
] as const
