import { ServiceType } from '../offer/shared-types'

/**
 * Tracking Status Enum
 * Represents the current status of a shipment
 */
export enum TrackingStatus {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_PENDING = 'BOOKING_PENDING',
  CARGO_READY = 'CARGO_READY',
  IN_TRANSIT = 'IN_TRANSIT',
  CUSTOMS_CLEARANCE = 'CUSTOMS_CLEARANCE',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

/**
 * Milestone Event Types
 * Key events in the shipping journey
 */
export enum MilestoneType {
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_PENDING = 'BOOKING_PENDING',
  CARGO_RECEIVED = 'CARGO_RECEIVED',
  LOADED = 'LOADED',
  DEPARTED = 'DEPARTED',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  CUSTOMS_SUBMITTED = 'CUSTOMS_SUBMITTED',
  CUSTOMS_CLEARED = 'CUSTOMS_CLEARED',
  UNLOADED = 'UNLOADED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION',
}

/**
 * Location information for tracking events
 */
export interface TrackingLocation {
  name: string
  code?: string
  city?: string
  country: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

/**
 * Milestone Event
 * Represents a single tracking event/milestone
 */
export interface TrackingMilestone {
  milestone_type: MilestoneType
  status: TrackingStatus
  timestamp: Date
  location?: TrackingLocation
  description: string
  notes?: string
  created_by?: string // User ID who created this milestone
}

/**
 * Base Tracking Information
 * Common fields for all tracking types
 */
export interface BaseTracking {
  tracking_id: string // Unique tracking identifier
  booking_id: string // Reference to booking (confirmed quote)
  service_type: ServiceType
  user_id: string // Customer/user who owns this shipment

  // Status
  current_status: TrackingStatus

  // Dates
  booking_date: Date
  estimated_delivery_date?: Date
  actual_delivery_date?: Date

  // Carrier information
  carrier: string
  carrier_reference?: string // Carrier's tracking number

  // Route
  origin: TrackingLocation
  destination: TrackingLocation

  // Milestones
  milestones: TrackingMilestone[]

  // Additional metadata
  special_instructions?: string
  is_active: boolean // false if cancelled or completed

  created_at?: Date
  updated_at?: Date
}

/**
 * Container Identifiers
 * Various identifiers used for container tracking
 */
export interface ContainerIdentifiers {
  container_id: string // Our internal container ID
  container_number?: string // Physical container number (e.g., MSCU1234567)
  seal_number?: string
  hbl_number?: string // House Bill of Lading
  mbl_number?: string // Master Bill of Lading
}

/**
 * Container Details
 * Information specific to a container
 */
export interface ContainerDetails extends ContainerIdentifiers {
  container_type: string // '20STD', '40HC', etc.
  weight?: number
  weight_unit?: 'KG' | 'LBS'
  volume?: number
  volume_unit?: 'CBM' | 'CFT'
  cargo_description?: string

  // Container-specific status and milestones
  status: TrackingStatus
  milestones: TrackingMilestone[]

  // Special handling requirements
  is_hazardous?: boolean // For DG
  dg_class?: string
  temperature?: number // For RF
  humidity?: number // For RF
  is_oversized?: boolean // For OOG/IG
}

/**
 * Container-Based Tracking
 * For services: SEA_FCL, SEA_DG, SEA_RF, SEA_IG, SEA_OOG
 * Tracks individual containers within a booking
 */
export interface ContainerTracking extends BaseTracking {
  service_type:
    | ServiceType.SEA_FCL
    | ServiceType.SEA_DG
    | ServiceType.SEA_RF
    | ServiceType.SEA_IG
    | ServiceType.SEA_OOG

  // Bill of Lading numbers at booking level
  master_bl_number?: string
  house_bl_number?: string

  // Container list
  containers: ContainerDetails[]
  total_containers: number

  // Vessel information (for sea freight)
  vessel_name?: string
  voyage_number?: string

  // Port information
  port_of_loading?: string
  port_of_discharge?: string
  final_destination?: string
}

/**
 * Booking-Based Tracking Identifiers
 * Various identifiers for non-container shipments
 */
export interface BookingIdentifiers {
  airway_bill_number?: string // For AIR
  bill_of_lading_number?: string // For SEA_LCL
  consignment_note?: string // For LAND
  warehouse_receipt_number?: string // For Warehouse
  tracking_number?: string // General tracking number
}

/**
 * Booking-Based Tracking
 * For services: SEA_LCL, LAND, AIR, Warehouse (FCL_WAR, LCL_WAR, LTL_WAR)
 * Tracks entire booking as a single unit
 */
export interface BookingTracking extends BaseTracking {
  service_type:
    | ServiceType.SEA_LCL
    | ServiceType.AIR
    | ServiceType.DOMESTIC_TRUCKING
    | ServiceType.SEAPORT_TRUCKING
    | ServiceType.AIRPORT_TRUCKING
    | ServiceType.FCL_WAR
    | ServiceType.LCL_WAR
    | ServiceType.LTL_WAR

  // Identifiers
  identifiers: BookingIdentifiers

  // Cargo details (at booking level)
  package_type: string
  total_packages?: number
  total_weight?: number
  weight_unit?: 'KG' | 'LBS' | 'TON'
  total_volume?: number
  volume_unit?: 'CBM' | 'CFT'
  cargo_description?: string

  // Service-specific fields
  flight_number?: string // For AIR
  flight_date?: Date // For AIR
  vessel_name?: string // For SEA_LCL
  voyage_number?: string // For SEA_LCL
  truck_number?: string // For LAND/TRUCKING
  driver_info?: {
    name: string
    phone: string
    license_number?: string
  } // For LAND/TRUCKING
  warehouse_location?: string // For Warehouse services
}

/**
 * Unified Tracking Type
 * Can be either container-based or booking-based tracking
 */
export type ShipmentTracking = ContainerTracking | BookingTracking

/**
 * Type guards to distinguish between tracking types
 */
export function isContainerTracking(
  tracking: ShipmentTracking
): tracking is ContainerTracking {
  return [
    ServiceType.SEA_FCL,
    ServiceType.SEA_DG,
    ServiceType.SEA_RF,
    ServiceType.SEA_IG,
    ServiceType.SEA_OOG,
  ].includes(tracking.service_type)
}

export function isBookingTracking(
  tracking: ShipmentTracking
): tracking is BookingTracking {
  return [
    ServiceType.SEA_LCL,
    ServiceType.AIR,
    ServiceType.DOMESTIC_TRUCKING,
    ServiceType.SEAPORT_TRUCKING,
    ServiceType.AIRPORT_TRUCKING,
    ServiceType.FCL_WAR,
    ServiceType.LCL_WAR,
    ServiceType.LTL_WAR,
  ].includes(tracking.service_type)
}

/**
 * Tracking Query Filters
 * For searching and filtering tracking records
 */
export interface TrackingQueryFilters {
  user_id?: string
  booking_id?: string
  service_type?: ServiceType
  status?: TrackingStatus
  carrier?: string
  container_number?: string
  tracking_number?: string
  date_from?: Date
  date_to?: Date
  is_active?: boolean
}
