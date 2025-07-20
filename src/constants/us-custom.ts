import { currencyConverter } from '@/lib/exchange'

//US custom fees
export const DELIVERY_FEE = 85
export const ISF = 35
export const CUSTOMS_FEE = 125
//document charge fee in INR
export const DOCUMENT_CHARGE_FEE = 5100
//security manifest document fee in INR
export const SECURITY_MANIFEST_DOCUMENT_FEE = 3750
export const CLEARANCE_FEE = 5000

export const CLEARANCE_FEE_OBJ = {
  label: 'Clearance Fee',
  currency: 'INR',
  inr: CLEARANCE_FEE,
  usd: currencyConverter({
    cost: CLEARANCE_FEE,
    sourceCurrency: 'INR',
    targetCurrency: 'USD',
  }),
}

export const DELIVERY_ORDER_FEE_OBJ = {
  name: 'Delivery Order Fee',
  code: 'DELIVERY_ORDER_FEE',
  currency: 'USD',
  value: DELIVERY_FEE,
}
export const ISF_OBJ = {
  name: 'ISF',
  code: 'ISF',
  currency: 'USD',
  value: ISF,
}

export const CUSTOMS_FEE_OBJ = {
  name: 'Customs Fee',
  code: 'CUSTOMS_FEE',
  currency: 'USD',
  value: CUSTOMS_FEE,
}
export const DOCUMENT_CHARGE_OBJ = {
  name: 'Document Charge',
  code: 'DOCUMENT_CHARGE',
  currency: 'INR',
  value: DOCUMENT_CHARGE_FEE,
}
export const SECURITY_MANIFEST_DOCUMENT_OBJ = {
  name: 'Security Manifest Document',
  code: 'SECURITY_MANIFEST_DOCUMENT',
  currency: 'INR',
  value: SECURITY_MANIFEST_DOCUMENT_FEE,
}

export const US_ALL_ADDITIONAL_FEES = [
  DELIVERY_ORDER_FEE_OBJ,
  ISF_OBJ,
  CUSTOMS_FEE_OBJ,
  // NOTE: ADDED In DB
  // DOCUMENT_CHARGE_OBJ,
  // SECURITY_MANIFEST_DOCUMENT_OBJ,
]
export const US_AIR_ADDITIONAL_FEES = [DELIVERY_ORDER_FEE_OBJ, CUSTOMS_FEE_OBJ]
