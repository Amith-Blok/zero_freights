import { ServiceType } from '../offer/shared-types'
import {
  TrackingStatus,
  MilestoneType,
  ShipmentTracking,
  ContainerTracking,
  TrackingMilestone,
  ContainerDetails,
  isContainerTracking,
} from './tracking-types'
import {
  ShipmentTrackingModel,
  SeaFclTrackingModel,
  SeaDgTrackingModel,
  SeaRfTrackingModel,
  SeaIgTrackingModel,
  SeaOogTrackingModel,
  SeaLclTrackingModel,
  AirTrackingModel,
  DomesticTruckingTrackingModel,
  SeaportTruckingTrackingModel,
  AirportTruckingTrackingModel,
  FclWarehouseTrackingModel,
  LclWarehouseTrackingModel,
  LtlWarehouseTrackingModel,
} from './tracking'

/**
 * Get the appropriate tracking model based on service type
 */
export function getTrackingModel(serviceType: ServiceType) {
  const modelMap = {
    [ServiceType.SEA_FCL]: SeaFclTrackingModel,
    [ServiceType.SEA_DG]: SeaDgTrackingModel,
    [ServiceType.SEA_RF]: SeaRfTrackingModel,
    [ServiceType.SEA_IG]: SeaIgTrackingModel,
    [ServiceType.SEA_OOG]: SeaOogTrackingModel,
    [ServiceType.SEA_LCL]: SeaLclTrackingModel,
    [ServiceType.AIR]: AirTrackingModel,
    [ServiceType.DOMESTIC_TRUCKING]: DomesticTruckingTrackingModel,
    [ServiceType.SEAPORT_TRUCKING]: SeaportTruckingTrackingModel,
    [ServiceType.AIRPORT_TRUCKING]: AirportTruckingTrackingModel,
    [ServiceType.FCL_WAR]: FclWarehouseTrackingModel,
    [ServiceType.LCL_WAR]: LclWarehouseTrackingModel,
    [ServiceType.LTL_WAR]: LtlWarehouseTrackingModel,
  }

  return modelMap[serviceType] || ShipmentTrackingModel
}

/**
 * Generate a unique tracking ID
 */
export function generateTrackingId(
  serviceType: ServiceType,
  bookingId: string
): string {
  const prefix = getTrackingPrefix(serviceType)
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${bookingId}-${timestamp}-${random}`
}

/**
 * Get tracking prefix based on service type
 */
function getTrackingPrefix(serviceType: ServiceType): string {
  const prefixMap: Record<ServiceType, string> = {
    [ServiceType.SEA_FCL]: 'SFCL',
    [ServiceType.SEA_LCL]: 'SLCL',
    [ServiceType.SEA_DG]: 'SDG',
    [ServiceType.SEA_RF]: 'SRF',
    [ServiceType.SEA_IG]: 'SIG',
    [ServiceType.SEA_OOG]: 'SOOG',
    [ServiceType.AIR]: 'AIR',
    [ServiceType.DOMESTIC_TRUCKING]: 'DTRU',
    [ServiceType.SEAPORT_TRUCKING]: 'STRU',
    [ServiceType.AIRPORT_TRUCKING]: 'ATRU',
    [ServiceType.FCL_WAR]: 'FWAR',
    [ServiceType.LCL_WAR]: 'LWAR',
    [ServiceType.LTL_WAR]: 'TWAR',
  }
  return prefixMap[serviceType] || 'TRK'
}

/**
 * Create a milestone event
 */
export function createMilestone(
  milestoneType: MilestoneType,
  status: TrackingStatus,
  description: string,
  location?: TrackingMilestone['location'],
  notes?: string,
  createdBy?: string
): TrackingMilestone {
  return {
    milestone_type: milestoneType,
    status,
    timestamp: new Date(),
    location,
    description,
    notes,
    created_by: createdBy,
  }
}

/**
 * Add milestone to tracking record
 */
export async function addMilestoneToTracking(
  trackingId: string,
  milestone: TrackingMilestone
): Promise<void> {
  await ShipmentTrackingModel.findOneAndUpdate(
    { tracking_id: trackingId },
    {
      $push: { milestones: milestone },
      $set: { current_status: milestone.status },
    }
  )
}

/**
 * Add milestone to a specific container
 */
export async function addMilestoneToContainer(
  trackingId: string,
  containerId: string,
  milestone: TrackingMilestone
): Promise<void> {
  await ShipmentTrackingModel.findOneAndUpdate(
    {
      tracking_id: trackingId,
      'containers.container_id': containerId,
    },
    {
      $push: { 'containers.$.milestones': milestone },
      $set: { 'containers.$.status': milestone.status },
    }
  )
}

/**
 * Update tracking status
 */
export async function updateTrackingStatus(
  trackingId: string,
  status: TrackingStatus,
  milestone?: TrackingMilestone
): Promise<void> {
  const update: any = { current_status: status }

  if (milestone) {
    update.$push = { milestones: milestone }
  }

  // Update delivery date if delivered
  if (status === TrackingStatus.DELIVERED) {
    update.actual_delivery_date = new Date()
    update.is_active = false
  }

  await ShipmentTrackingModel.findOneAndUpdate(
    { tracking_id: trackingId },
    update
  )
}

/**
 * Find tracking by various identifiers
 */
export async function findTrackingByIdentifier(params: {
  identifier: string
  userId: string
}): Promise<ShipmentTracking | null> {
  const { identifier, userId } = params

  // Try tracking_id first
  let tracking = await ShipmentTrackingModel.findOne({
    tracking_id: identifier,
    user_id: userId,
  }).lean()
  if (tracking) return tracking

  // Try bookingId
  tracking = await ShipmentTrackingModel.findOne({
    booking_id: identifier,
    user_id: userId,
  }).lean()
  if (tracking) return tracking

  // Try container number (for container-based tracking)
  tracking = await ShipmentTrackingModel.findOne({
    'containers.container_number': identifier,
    user_id: userId,
  }).lean()
  if (tracking) return tracking

  // Try various booking identifiers
  tracking = await ShipmentTrackingModel.findOne({
    user_id: userId,
    $or: [
      { master_bl_number: identifier },
      { house_bl_number: identifier },
      { 'containers.hbl_number': identifier },
      { 'containers.mbl_number': identifier },
      { 'identifiers.airway_bill_number': identifier },
      { 'identifiers.bill_of_lading_number': identifier },
      { 'identifiers.consignment_note': identifier },
      { 'identifiers.warehouse_receipt_number': identifier },
      { 'identifiers.tracking_number': identifier },
      { carrier_reference: identifier },
    ],
  }).lean()

  return tracking
}

/**
 * Get all trackings for a user
 */
export async function getUserTrackings(
  userId: string,
  filters?: {
    service_type?: ServiceType
    status?: TrackingStatus
    is_active?: boolean
  }
): Promise<ShipmentTracking[]> {
  const query: any = { user_id: userId }

  if (filters?.service_type) {
    query.service_type = filters.service_type
  }

  if (filters?.status) {
    query.current_status = filters.status
  }

  if (filters?.is_active !== undefined) {
    query.is_active = filters.is_active
  }

  return await ShipmentTrackingModel.find(query).sort({ created_at: -1 })
}

/**
 * Get all trackings for a booking
 */
export async function getBookingTrackings(
  bookingId: string
): Promise<ShipmentTracking[]> {
  return await ShipmentTrackingModel.find({ booking_id: bookingId })
}

/**
 * Get container details by container number
 */
export async function getContainerByNumber(containerNumber: string): Promise<{
  tracking: ContainerTracking
  container: ContainerDetails
} | null> {
  const tracking = (await ShipmentTrackingModel.findOne({
    'containers.container_number': containerNumber,
  })) as ContainerTracking | null

  if (!tracking || !isContainerTracking(tracking)) {
    return null
  }

  const container = tracking.containers.find(
    (c) => c.container_number === containerNumber
  )

  if (!container) {
    return null
  }

  return { tracking, container }
}

/**
 * Calculate tracking progress percentage
 */
export function calculateTrackingProgress(status: TrackingStatus): number {
  const progressMap: Record<TrackingStatus, number> = {
    [TrackingStatus.BOOKING_PENDING]: 0,
    [TrackingStatus.BOOKING_CONFIRMED]: 10,
    [TrackingStatus.CARGO_READY]: 20,
    [TrackingStatus.IN_TRANSIT]: 50,
    [TrackingStatus.CUSTOMS_CLEARANCE]: 70,
    [TrackingStatus.OUT_FOR_DELIVERY]: 85,
    [TrackingStatus.DELIVERED]: 100,
    [TrackingStatus.ON_HOLD]: 0,
    [TrackingStatus.CANCELLED]: 0,
  }

  return progressMap[status] || 0
}

/**
 * Get estimated days remaining
 */
export function getEstimatedDaysRemaining(
  tracking: ShipmentTracking
): number | null {
  if (!tracking.estimated_delivery_date) {
    return null
  }

  const now = new Date()
  const estimatedDate = new Date(tracking.estimated_delivery_date)
  const diffTime = estimatedDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : 0
}

/**
 * Check if tracking is delayed
 */
export function isTrackingDelayed(tracking: ShipmentTracking): boolean {
  if (
    !tracking.estimated_delivery_date ||
    tracking.current_status === TrackingStatus.DELIVERED
  ) {
    return false
  }

  const now = new Date()
  const estimatedDate = new Date(tracking.estimated_delivery_date)

  return now > estimatedDate
}

/**
 * Get tracking summary for dashboard
 */
export interface TrackingSummary {
  total_shipments: number
  active_shipments: number
  in_transit: number
  delivered: number
  delayed: number
  on_hold: number
}

export async function getTrackingSummary(
  userId: string
): Promise<TrackingSummary> {
  const allTrackings = await getUserTrackings(userId)

  return {
    total_shipments: allTrackings.length,
    active_shipments: allTrackings.filter((t) => t.is_active).length,
    in_transit: allTrackings.filter(
      (t) => t.current_status === TrackingStatus.IN_TRANSIT
    ).length,
    delivered: allTrackings.filter(
      (t) => t.current_status === TrackingStatus.DELIVERED
    ).length,
    delayed: allTrackings.filter((t) => isTrackingDelayed(t)).length,
    on_hold: allTrackings.filter(
      (t) => t.current_status === TrackingStatus.ON_HOLD
    ).length,
  }
}
