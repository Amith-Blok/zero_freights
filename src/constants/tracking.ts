import { ServiceType } from '@/models/offer/shared-types'

export const TrackingServiceTypeMapper = {
  [ServiceType.SEA_FCL]: 'Sea FCL',
  [ServiceType.SEA_LCL]: 'Sea LCL',
  [ServiceType.SEA_DG]: 'Sea DG',
  [ServiceType.SEA_RF]: 'Sea RF',
  [ServiceType.SEA_IG]: 'Sea IG',
  [ServiceType.SEA_OOG]: 'Sea OOG',
  [ServiceType.AIR]: 'Air Freight',
  [ServiceType.DOMESTIC_TRUCKING]: 'Domestic Trucking',
  [ServiceType.SEAPORT_TRUCKING]: 'Seaport Trucking',
  [ServiceType.AIRPORT_TRUCKING]: 'Airport Trucking',
  [ServiceType.FCL_WAR]: 'FCL Warehouse',
  [ServiceType.LCL_WAR]: 'LCL Warehouse',
  [ServiceType.LTL_WAR]: 'LTL Warehouse',
} as const satisfies Record<ServiceType, string>
