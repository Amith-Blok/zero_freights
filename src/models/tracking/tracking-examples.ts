/**
 * TRACKING SYSTEM USAGE EXAMPLES
 *
 * This file contains practical examples of how to use the tracking system
 * for different service types in your freight forwarding application.
 */

import {
  ContainerTracking,
  BookingTracking,
  TrackingStatus,
  MilestoneType,
} from './tracking-types'
import {
  generateTrackingId,
  createMilestone,
  addMilestoneToTracking,
  addMilestoneToContainer,
  findTrackingByIdentifier,
  getBookingTrackings,
  getContainerByNumber,
  getTrackingSummary,
} from './tracking-utils'
import { ServiceType } from '../offer/shared-types'
import {
  SeaFclTrackingModel,
  AirTrackingModel,
  SeaLclTrackingModel,
} from './tracking'

// ============================================================================
// EXAMPLE 1: Create Container-Based Tracking (SEA FCL)
// ============================================================================

export async function createSeaFclTracking() {
  const tracking: Partial<ContainerTracking> = {
    tracking_id: generateTrackingId(ServiceType.SEA_FCL, 'BLOK123'),
    booking_id: 'BLOK123', // Reference to confirmed quote
    service_type: ServiceType.SEA_FCL,
    user_id: 'user_xyz',

    current_status: TrackingStatus.BOOKING_CONFIRMED,
    booking_date: new Date(),
    estimated_delivery_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now

    carrier: 'Maersk Line',
    carrier_reference: 'MAEU1234567890',

    origin: {
      name: 'Port of Shanghai',
      code: 'CNSHA',
      city: 'Shanghai',
      country: 'China',
    },
    destination: {
      name: 'Jawaharlal Nehru Port',
      code: 'INNSA',
      city: 'Mumbai',
      country: 'India',
    },

    milestones: [
      createMilestone(
        MilestoneType.BOOKING_CREATED,
        TrackingStatus.BOOKING_CONFIRMED,
        'Booking confirmed and containers allocated',
        {
          name: 'Zero Freights Office',
          country: 'India',
          city: 'Mumbai',
        }
      ),
    ],

    is_active: true,

    // FCL-specific fields
    master_bl_number: 'MAEU123456789',
    house_bl_number: 'ZF2024001',
    vessel_name: 'MSC APOLLO',
    voyage_number: 'V123N',
    port_of_loading: 'CNSHA',
    port_of_discharge: 'INNSA',
    final_destination: 'INNSA',

    // Container list
    total_containers: 2,
    containers: [
      {
        container_id: 'CONT001',
        container_number: 'MSCU1234567',
        seal_number: 'SEAL001',
        hbl_number: 'ZF2024001',
        mbl_number: 'MAEU123456789',
        container_type: '40HC',
        weight: 20000,
        weight_unit: 'KG',
        cargo_description: 'Electronic Equipment',
        status: TrackingStatus.BOOKING_CONFIRMED,
        milestones: [],
      },
      {
        container_id: 'CONT002',
        container_number: 'MSCU7654321',
        seal_number: 'SEAL002',
        hbl_number: 'ZF2024001',
        mbl_number: 'MAEU123456789',
        container_type: '40HC',
        weight: 18000,
        weight_unit: 'KG',
        cargo_description: 'Electronic Equipment',
        status: TrackingStatus.BOOKING_CONFIRMED,
        milestones: [],
      },
    ],
  }

  const savedTracking = await SeaFclTrackingModel.create(tracking)
  console.log('Created FCL Tracking:', savedTracking.tracking_id)
  return savedTracking
}

// ============================================================================
// EXAMPLE 2: Create Container-Based Tracking for Reefer (SEA RF)
// ============================================================================

export async function createSeaRfTracking() {
  // Similar to FCL but with temperature/humidity in container details
  const tracking: Partial<ContainerTracking> = {
    tracking_id: generateTrackingId(ServiceType.SEA_RF, 'BLOK124'),
    booking_id: 'BLOK124',
    service_type: ServiceType.SEA_RF,
    user_id: 'user_xyz',

    current_status: TrackingStatus.BOOKING_CONFIRMED,
    booking_date: new Date(),
    estimated_delivery_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),

    carrier: 'CMA CGM',

    origin: {
      name: 'Port of Rotterdam',
      code: 'NLRTM',
      city: 'Rotterdam',
      country: 'Netherlands',
    },
    destination: {
      name: 'Jawaharlal Nehru Port',
      code: 'INNSA',
      city: 'Mumbai',
      country: 'India',
    },

    milestones: [],
    is_active: true,

    total_containers: 1,
    containers: [
      {
        container_id: 'CONT003',
        container_number: 'CMAU9876543',
        seal_number: 'SEAL003',
        container_type: '40RF',
        weight: 15000,
        weight_unit: 'KG',
        cargo_description: 'Fresh Fruits',
        status: TrackingStatus.BOOKING_CONFIRMED,
        milestones: [],

        // Reefer-specific
        temperature: -18, // Celsius
        humidity: 85, // Percentage
      },
    ],
  }

  return await SeaFclTrackingModel.create(tracking)
}

// ============================================================================
// EXAMPLE 3: Create Booking-Based Tracking (AIR)
// ============================================================================

export async function createAirTracking() {
  const tracking: Partial<BookingTracking> = {
    tracking_id: generateTrackingId(ServiceType.AIR, 'BLOK125'),
    booking_id: 'BLOK125',
    service_type: ServiceType.AIR,
    user_id: 'user_abc',

    current_status: TrackingStatus.BOOKING_CONFIRMED,
    booking_date: new Date(),
    estimated_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days

    carrier: 'Emirates SkyCargo',
    carrier_reference: 'EK-AWB-12345678',

    origin: {
      name: 'Dubai International Airport',
      code: 'DXB',
      city: 'Dubai',
      country: 'UAE',
    },
    destination: {
      name: 'Indira Gandhi International Airport',
      code: 'DEL',
      city: 'Delhi',
      country: 'India',
    },

    milestones: [
      createMilestone(
        MilestoneType.BOOKING_CREATED,
        TrackingStatus.BOOKING_CONFIRMED,
        'Air freight booking confirmed'
      ),
    ],

    is_active: true,

    // Booking-specific identifiers
    identifiers: {
      airway_bill_number: 'AWB-176-12345678',
      tracking_number: 'EK-TRK-987654',
    },

    // Cargo details
    package_type: 'Pallets',
    total_packages: 5,
    total_weight: 1500,
    weight_unit: 'KG',
    total_volume: 8.5,
    volume_unit: 'CBM',
    cargo_description: 'Pharmaceuticals',

    // Air-specific
    flight_number: 'EK-512',
    flight_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  }

  const savedTracking = await AirTrackingModel.create(tracking)
  console.log('Created Air Tracking:', savedTracking.tracking_id)
  return savedTracking
}

// ============================================================================
// EXAMPLE 4: Create Booking-Based Tracking (SEA LCL)
// ============================================================================

export async function createSeaLclTracking() {
  const tracking: Partial<BookingTracking> = {
    tracking_id: generateTrackingId(ServiceType.SEA_LCL, 'BLOK126'),
    booking_id: 'BLOK126',
    service_type: ServiceType.SEA_LCL,
    user_id: 'user_abc',

    current_status: TrackingStatus.BOOKING_CONFIRMED,
    booking_date: new Date(),
    estimated_delivery_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),

    carrier: 'MSC',

    origin: {
      name: 'Port of Hamburg',
      code: 'DEHAM',
      city: 'Hamburg',
      country: 'Germany',
    },
    destination: {
      name: 'Jawaharlal Nehru Port',
      code: 'INNSA',
      city: 'Mumbai',
      country: 'India',
    },

    milestones: [],
    is_active: true,

    identifiers: {
      bill_of_lading_number: 'MSCU-BL-2024-001',
      tracking_number: 'MSC-TRK-456789',
    },

    package_type: 'Cartons',
    total_packages: 50,
    total_weight: 2500,
    weight_unit: 'KG',
    total_volume: 15,
    volume_unit: 'CBM',
    cargo_description: 'Textile Goods',

    vessel_name: 'MSC AURORA',
    voyage_number: 'V456E',
  }

  return await SeaLclTrackingModel.create(tracking)
}

// ============================================================================
// EXAMPLE 5: Update Tracking with Milestones
// ============================================================================

export async function updateTrackingWithMilestones(trackingId: string) {
  // Add milestone when cargo is received
  await addMilestoneToTracking(
    trackingId,
    createMilestone(
      MilestoneType.CARGO_RECEIVED,
      TrackingStatus.CARGO_READY,
      'Cargo received at origin warehouse',
      {
        name: 'Shanghai Warehouse',
        code: 'WH-SHA-001',
        city: 'Shanghai',
        country: 'China',
        coordinates: {
          latitude: 31.2304,
          longitude: 121.4737,
        },
      }
    )
  )

  // Add milestone when loaded onto vessel
  await addMilestoneToTracking(
    trackingId,
    createMilestone(
      MilestoneType.LOADED,
      TrackingStatus.IN_TRANSIT,
      'Containers loaded onto vessel',
      {
        name: 'Port of Shanghai',
        code: 'CNSHA',
        city: 'Shanghai',
        country: 'China',
      }
    )
  )

  // Add milestone when departed
  await addMilestoneToTracking(
    trackingId,
    createMilestone(
      MilestoneType.DEPARTED,
      TrackingStatus.IN_TRANSIT,
      'Vessel departed from Port of Shanghai',
      {
        name: 'Port of Shanghai',
        code: 'CNSHA',
        city: 'Shanghai',
        country: 'China',
      }
    )
  )
}

// ============================================================================
// EXAMPLE 6: Update Individual Container Status (FCL)
// ============================================================================

export async function updateContainerMilestone(
  trackingId: string,
  containerId: string
) {
  // Add milestone to specific container
  await addMilestoneToContainer(
    trackingId,
    containerId,
    createMilestone(
      MilestoneType.CUSTOMS_CLEARED,
      TrackingStatus.CUSTOMS_CLEARANCE,
      'Container cleared by customs',
      {
        name: 'JNPT Customs',
        code: 'INNSA-CUS',
        city: 'Mumbai',
        country: 'India',
      },
      'All documents verified, duty paid'
    )
  )
}

// ============================================================================
// EXAMPLE 7: Search Tracking by Various Identifiers
// ============================================================================

export async function searchTracking() {
  // Search by tracking ID
  const tracking1 = await findTrackingByIdentifier('SFCL-ABC123-XYZ')

  // Search by booking number (blok_id)
  const tracking2 = await findTrackingByIdentifier('BLOK123')

  // Search by container number
  const tracking3 = await findTrackingByIdentifier('MSCU1234567')

  // Search by Bill of Lading
  const tracking4 = await findTrackingByIdentifier('MAEU123456789')

  // Search by Airway Bill Number
  const tracking5 = await findTrackingByIdentifier('AWB-176-12345678')

  return {
    tracking1,
    tracking2,
    tracking3,
    tracking4,
    tracking5,
  }
}

// ============================================================================
// EXAMPLE 8: Get All Trackings for a Booking
// ============================================================================

export async function getBookingTrackingInfo(blokId: string) {
  // Get all tracking records associated with a booking
  const trackings = await getBookingTrackings(blokId)

  console.log(
    `Found ${trackings.length} tracking records for booking ${blokId}`
  )

  trackings.forEach((tracking) => {
    console.log(`- Tracking ID: ${tracking.tracking_id}`)
    console.log(`  Status: ${tracking.current_status}`)
    console.log(`  Service: ${tracking.service_type}`)
    console.log(`  Carrier: ${tracking.carrier}`)
  })

  return trackings
}

// ============================================================================
// EXAMPLE 9: Get Container Details by Container Number
// ============================================================================

export async function getContainerInfo(containerNumber: string) {
  const result = await getContainerByNumber(containerNumber)

  if (!result) {
    console.log('Container not found')
    return null
  }

  console.log('Container Details:')
  console.log(`- Container Number: ${result.container.container_number}`)
  console.log(`- Type: ${result.container.container_type}`)
  console.log(`- Status: ${result.container.status}`)
  console.log(
    `- Weight: ${result.container.weight} ${result.container.weight_unit}`
  )
  console.log(`\nShipment Details:`)
  console.log(`- Tracking ID: ${result.tracking.tracking_id}`)
  console.log(`- Booking ID: ${result.tracking.booking_id}`)
  console.log(`- Vessel: ${result.tracking.vessel_name}`)
  console.log(`- Total Containers: ${result.tracking.total_containers}`)

  return result
}

// ============================================================================
// EXAMPLE 10: Get User Dashboard Summary
// ============================================================================

export async function getUserDashboard(userId: string) {
  const summary = await getTrackingSummary(userId)

  console.log('Tracking Dashboard Summary:')
  console.log(`- Total Shipments: ${summary.total_shipments}`)
  console.log(`- Active Shipments: ${summary.active_shipments}`)
  console.log(`- In Transit: ${summary.in_transit}`)
  console.log(`- Delivered: ${summary.delivered}`)
  console.log(`- Delayed: ${summary.delayed}`)
  console.log(`- On Hold: ${summary.on_hold}`)

  return summary
}

// ============================================================================
// EXAMPLE 11: Complete Tracking Workflow (FCL)
// ============================================================================

export async function completeTrackingWorkflow() {
  // 1. Create tracking when booking is confirmed
  const tracking = await createSeaFclTracking()
  console.log('Step 1: Tracking created')

  // 2. Update when cargo is ready
  await addMilestoneToTracking(
    tracking.tracking_id,
    createMilestone(
      MilestoneType.CARGO_RECEIVED,
      TrackingStatus.CARGO_READY,
      'Cargo received at warehouse'
    )
  )
  console.log('Step 2: Cargo received')

  // 3. Update when loaded
  await addMilestoneToTracking(
    tracking.tracking_id,
    createMilestone(
      MilestoneType.LOADED,
      TrackingStatus.IN_TRANSIT,
      'Containers loaded onto vessel'
    )
  )
  console.log('Step 3: Containers loaded')

  // 4. Update when in transit
  await addMilestoneToTracking(
    tracking.tracking_id,
    createMilestone(
      MilestoneType.DEPARTED,
      TrackingStatus.IN_TRANSIT,
      'Vessel departed'
    )
  )
  console.log('Step 4: In transit')

  // 5. Update when arrived at port
  await addMilestoneToTracking(
    tracking.tracking_id,
    createMilestone(
      MilestoneType.ARRIVED,
      TrackingStatus.IN_TRANSIT,
      'Vessel arrived at destination port'
    )
  )
  console.log('Step 5: Arrived at port')

  // 6. Update customs status
  await addMilestoneToTracking(
    tracking.tracking_id,
    createMilestone(
      MilestoneType.CUSTOMS_CLEARED,
      TrackingStatus.CUSTOMS_CLEARANCE,
      'Customs clearance completed'
    )
  )
  console.log('Step 6: Customs cleared')

  // 7. Update when out for delivery
  await addMilestoneToTracking(
    tracking.tracking_id,
    createMilestone(
      MilestoneType.OUT_FOR_DELIVERY,
      TrackingStatus.OUT_FOR_DELIVERY,
      'Containers dispatched for final delivery'
    )
  )
  console.log('Step 7: Out for delivery')

  // 8. Update when delivered
  await addMilestoneToTracking(
    tracking.tracking_id,
    createMilestone(
      MilestoneType.DELIVERED,
      TrackingStatus.DELIVERED,
      'Containers delivered to customer'
    )
  )
  console.log('Step 8: Delivered')

  return tracking
}
