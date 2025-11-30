import {
  createMilestone,
  generateTrackingId,
  getTrackingModel,
  isContainerTracking,
  ShipmentTracking,
  TrackingStatus,
  findTrackingByIdentifier,
  getUserTrackings,
} from '@/models/tracking'
import {
  ContainerDetails,
  MilestoneType,
} from '@/models/tracking/tracking-types'
import {
  ContainerTrackingDocument,
  BookingTrackingDocument,
  ShipmentTrackingModel,
} from '@/models/tracking/tracking'
import type mongoose from 'mongoose'
import { ServiceType } from '@/models/offer/shared-types'

export interface TrackingAdditionalData {
  bookingTrackingAdditionalData?: BookingTrackingAdditionalData
  containerTrackingAdditionalData?: ContainerTrackingAdditionalData
}
export interface BookingTrackingAdditionalData {
  booking_date?: Date
  package_type?: string
  carrier_name?: string
  total_packages?: number
  total_weight?: number
  total_volume?: number
  weight_unit?: 'KG' | 'LBS' | 'TON'
  volume_unit?: 'CBM' | 'CFT'
  cargo_description?: string
  flight_number?: string
  flight_date?: Date
  vessel_name?: string
  voyage_number?: string
  truck_number?: string
  driver_info?: {
    name?: string
    phone?: string
    license_number?: string
  }
  warehouse_location?: string
}
export interface ContainerTrackingAdditionalData {
  containers?: ContainerDetails[]
  carrier_name?: string
  booking_date?: Date
  total_containers?: number
}
//TODO: Fix Typing
export async function createTrackingFromBooking(params: {
  confirmedQuote: any
  additionalData?: TrackingAdditionalData
}) {
  const { confirmedQuote } = params
  console.log(
    'createTrackingFromBooking - service_type:',
    confirmedQuote.service_type
  )
  console.log(
    'createTrackingFromBooking - isContainerTracking check:',
    isContainerTracking(confirmedQuote as unknown as ShipmentTracking)
  )
  // Build tracking data based on service type
  if (isContainerTracking(confirmedQuote as unknown as ShipmentTracking)) {
    const containers =
      params.additionalData?.containerTrackingAdditionalData?.containers || []
    const total_containers =
      params.additionalData?.containerTrackingAdditionalData
        ?.total_containers ?? containers.length
    const carrier =
      params.additionalData?.containerTrackingAdditionalData?.carrier_name || ''
    const bookingDate =
      params.additionalData?.containerTrackingAdditionalData?.booking_date ||
      new Date(new Date().toISOString())

    // Validate that we have containers
    if (!total_containers || total_containers === 0) {
      throw new Error(
        `Cannot create container tracking: total_containers is ${total_containers}. Container tracking requires at least one container.`
      )
    }

    const model = getTrackingModel(
      confirmedQuote.service_type
    ) as mongoose.Model<ContainerTrackingDocument>
    console.log(
      'Using CONTAINER tracking model:',
      model.modelName,
      'Collection:',
      model.collection.name
    )

    const trackingData = {
      tracking_id: generateTrackingId(
        confirmedQuote.service_type,
        confirmedQuote.blok_id
      ),
      booking_id: confirmedQuote.blok_id,
      service_type: confirmedQuote.service_type,
      user_id: confirmedQuote.user_id,
      current_status: TrackingStatus.BOOKING_PENDING,
      booking_date: bookingDate,
      carrier: carrier,
      carrier_reference: '',
      origin: {
        name: confirmedQuote.locations.at(0)?.name || '',
        code: confirmedQuote.locations.at(0)?.code || '',
        city: '',
        country: '',
      },
      destination: {
        name: confirmedQuote.locations.at(-1)?.name || '',
        code: confirmedQuote.locations.at(-1)?.code || '',
        city: '',
        country: '',
      },
      milestones: [
        createMilestone(
          MilestoneType.BOOKING_CREATED,
          TrackingStatus.BOOKING_PENDING,
          'Booking created'
        ),
      ],
      containers: containers,
      total_containers: total_containers,
      is_active: true,
    }

    console.log(
      'Container tracking data to be saved:',
      JSON.stringify(trackingData, null, 2)
    )
    return await model.create(trackingData)
  } else {
    // Booking-based tracking
    const additionalData =
      params.additionalData?.bookingTrackingAdditionalData || {}
    const carrier =
      params.additionalData?.bookingTrackingAdditionalData?.carrier_name || ''
    const bookingDate =
      params.additionalData?.bookingTrackingAdditionalData?.booking_date ||
      new Date(new Date().toISOString())
    console.log('Additional data', additionalData)
    const model = getTrackingModel(
      confirmedQuote.service_type
    ) as mongoose.Model<BookingTrackingDocument>
    console.log(
      'Using model:',
      model.modelName,
      'Collection:',
      model.collection.name
    )

    const trackingData = {
      tracking_id: generateTrackingId(
        confirmedQuote.service_type,
        confirmedQuote.blok_id
      ),
      booking_id: confirmedQuote.blok_id,
      service_type: confirmedQuote.service_type,
      user_id: confirmedQuote.user_id,
      current_status: TrackingStatus.BOOKING_PENDING,
      booking_date: bookingDate,
      carrier: carrier,
      carrier_reference: '',
      origin: {
        name: confirmedQuote.locations.at(0)?.name || '',
        code: confirmedQuote.locations.at(0)?.code || '',
        city: '',
        country: '',
      },
      destination: {
        name: confirmedQuote.locations.at(-1)?.name || '',
        code: confirmedQuote.locations.at(-1)?.code || '',
        city: '',
        country: '',
      },
      milestones: [
        createMilestone(
          //TODO: Fix It properly
          MilestoneType.BOOKING_CREATED,
          TrackingStatus.BOOKING_PENDING,
          'Booking pending'
        ),
      ],
      // Required identifiers field for BookingTracking
      // These are typically assigned by carriers/warehouses after booking
      identifiers: {
        airway_bill_number: '',
        bill_of_lading_number: '',
        consignment_note: '',
        warehouse_receipt_number: '',
        tracking_number: '',
      },
      package_type: additionalData.package_type || '',
      total_packages: additionalData.total_packages || 0,
      total_weight: additionalData.total_weight || 0,
      total_volume: additionalData.total_volume || 0,
      weight_unit: additionalData.weight_unit || 'KG',
      volume_unit: additionalData.volume_unit || 'CBM',
      cargo_description: additionalData.cargo_description || '',
      flight_number: additionalData.flight_number || '',
      flight_date: additionalData.flight_date || new Date(),
      vessel_name: additionalData.vessel_name || '',
      voyage_number: additionalData.voyage_number || '',
      truck_number: additionalData.truck_number || '',
      driver_info: additionalData.driver_info || {
        name: '',
        phone: '',
        license_number: '',
      },
      warehouse_location: additionalData.warehouse_location || '',
      is_active: true,
    }

    console.log('Data to be saved:', JSON.stringify(trackingData, null, 2))
    const tracking = await model.create(trackingData)
    console.log('Tracking created successfully:', tracking.toObject())
    console.log(
      'Checking fields - package_type:',
      tracking.package_type,
      'identifiers:',
      tracking.identifiers
    )
    return tracking
  }
}

/**
 * Get tracking by tracking ID
 * @param trackingId - The tracking ID to search for
 * @returns The tracking document or null if not found
 */
export async function getTrackingById(
  trackingId: string
): Promise<ShipmentTracking | null> {
  try {
    const tracking = await ShipmentTrackingModel.findOne({
      tracking_id: trackingId,
    })
    return tracking
  } catch (error) {
    console.error('Error fetching tracking by ID:', error)
    throw error
  }
}

/**
 * Get tracking by user ID and any identifier
 * This function searches for tracking by user_id and any of the following:
 * - tracking_id
 * - booking_id
 * - container_number
 * - BL numbers
 * - AWB numbers
 * - other identifiers
 * @param userId - The user ID
 * @param identifier - Any tracking identifier
 * @returns The tracking document or null if not found
 */
export async function getTrackingByUserAndIdentifier(
  userId: string,
  identifier: string
): Promise<ShipmentTracking | null> {
  try {
    // First, find tracking by identifier
    const tracking = await findTrackingByIdentifier({
      identifier: identifier,
      userId: userId,
    })

    // Verify that the tracking belongs to this user
    if (tracking && tracking.user_id === userId) {
      return tracking
    }

    return null
  } catch (error) {
    console.error('Error fetching tracking by user and identifier:', error)
    throw error
  }
}

/**
 * Get all trackings for a user with optional filters
 * @param userId - The user ID
 * @param filters - Optional filters for service type, status, and active state
 * @returns Array of tracking documents
 */
export async function getUserTrackingsList(
  userId: string,
  filters?: {
    service_type?: ServiceType
    status?: TrackingStatus
    is_active?: boolean
  }
): Promise<ShipmentTracking[]> {
  try {
    return await getUserTrackings(userId, filters)
  } catch (error) {
    console.error('Error fetching user trackings:', error)
    throw error
  }
}

/**
 * Get tracking by booking ID
 * @param bookingId - The booking ID (blok_id)
 * @returns The tracking document or null if not found
 */
export async function getTrackingByBookingId(
  bookingId: string
): Promise<ShipmentTracking | null> {
  try {
    const tracking = await ShipmentTrackingModel.findOne({
      booking_id: bookingId,
    })
    return tracking
  } catch (error) {
    console.error('Error fetching tracking by booking ID:', error)
    throw error
  }
}

/**
 * Get tracking by any identifier (public search - no user verification)
 * Useful for public tracking pages
 * @param identifier - Any tracking identifier
 * @returns The tracking document or null if not found
 */
export async function getTrackingByAnyIdentifier(
  identifier: string,
  userId: string
): Promise<ShipmentTracking | null> {
  try {
    return await findTrackingByIdentifier({
      identifier: identifier,
      userId: userId,
    })
  } catch (error) {
    console.error('Error fetching tracking by identifier:', error)
    throw error
  }
}

/**
 * Check if tracking exists and belongs to user
 * @param trackingId - The tracking ID
 * @param userId - The user ID to verify ownership
 * @returns Boolean indicating if tracking exists and belongs to user
 */
export async function verifyTrackingOwnership(
  trackingId: string,
  userId: string
): Promise<boolean> {
  try {
    const tracking = await ShipmentTrackingModel.findOne({
      tracking_id: trackingId,
      user_id: userId,
    })
    return !!tracking
  } catch (error) {
    console.error('Error verifying tracking ownership:', error)
    return false
  }
}
