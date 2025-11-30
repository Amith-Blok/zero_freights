# Freight Tracking System Documentation

A comprehensive tracking system for freight forwarding operations supporting 13 different service types with both container-level and booking-level tracking capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Service Types](#service-types)
3. [Tracking Models](#tracking-models)
4. [Key Concepts](#key-concepts)
5. [Usage Guide](#usage-guide)
6. [API Reference](#api-reference)
7. [Examples](#examples)

---

## Overview

The tracking system is designed to handle two distinct tracking approaches:

### 1. **Container-Based Tracking** (FCL Services)

Tracks individual containers within a booking. Each container has its own status and milestones.

**Services:**

- SEA_FCL (Full Container Load)
- SEA_DG (Dangerous Goods)
- SEA_RF (Reefer - Temperature Controlled)
- SEA_IG (In-Gauge Special Equipment)
- SEA_OOG (Out of Gauge Oversized)

### 2. **Booking-Based Tracking** (LCL & Other Services)

Tracks the entire booking as a single unit.

**Services:**

- SEA_LCL (Less than Container Load)
- AIR (Air Freight)
- DOMESTIC_TRUCKING
- SEAPORT_TRUCKING
- AIRPORT_TRUCKING
- FCL_WAR (FCL Warehouse)
- LCL_WAR (LCL Warehouse)
- LTL_WAR (LTL Warehouse)

---

## Service Types

```typescript
enum ServiceType {
  // Container-based tracking
  SEA_FCL = 'SEA FCL',
  SEA_DG = 'SEA DG',
  SEA_RF = 'SEA RF',
  SEA_IG = 'SEA IG',
  SEA_OOG = 'SEA OOG',

  // Booking-based tracking
  SEA_LCL = 'SEA LCL',
  AIR = 'AIR',
  DOMESTIC_TRUCKING = 'DOMESTIC TRUCKING',
  SEAPORT_TRUCKING = 'SEAPORT TRUCKING',
  AIRPORT_TRUCKING = 'AIRPORT TRUCKING',
  FCL_WAR = 'FCL WAR',
  LCL_WAR = 'LCL WAR',
  LTL_WAR = 'LTL WAR',
}
```

---

## Tracking Models

### Container Tracking Model

Used for FCL services where individual containers need to be tracked.

```typescript
interface ContainerTracking {
  // Base tracking info
  tracking_id: string
  blok_id: string // Booking reference
  service_type: ServiceType
  user_id: string
  current_status: TrackingStatus

  // Container-specific
  master_bl_number?: string
  house_bl_number?: string
  containers: ContainerDetails[]
  total_containers: number
  vessel_name?: string
  voyage_number?: string

  // Locations and dates
  origin: TrackingLocation
  destination: TrackingLocation
  booking_date: Date
  estimated_delivery_date?: Date

  // Tracking history
  milestones: TrackingMilestone[]
}
```

### Booking Tracking Model

Used for LCL, Air, Land, and Warehouse services.

```typescript
interface BookingTracking {
  // Base tracking info
  tracking_id: string
  blok_id: string
  service_type: ServiceType
  user_id: string
  current_status: TrackingStatus

  // Booking-specific identifiers
  identifiers: {
    airway_bill_number?: string
    bill_of_lading_number?: string
    consignment_note?: string
    warehouse_receipt_number?: string
    tracking_number?: string
  }

  // Cargo details
  package_type: string
  total_packages?: number
  total_weight?: number
  cargo_description?: string

  // Service-specific
  flight_number?: string // For AIR
  vessel_name?: string // For SEA_LCL
  truck_number?: string // For TRUCKING
  warehouse_location?: string // For WAREHOUSE

  // Locations and dates
  origin: TrackingLocation
  destination: TrackingLocation
  milestones: TrackingMilestone[]
}
```

---

## Key Concepts

### Tracking Status

The current state of a shipment:

```typescript
enum TrackingStatus {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  CARGO_READY = 'CARGO_READY',
  IN_TRANSIT = 'IN_TRANSIT',
  CUSTOMS_CLEARANCE = 'CUSTOMS_CLEARANCE',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}
```

### Milestones

Key events in the shipping journey:

```typescript
enum MilestoneType {
  BOOKING_CREATED = 'BOOKING_CREATED',
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
```

### Identifiers

Different identifiers for tracking:

**Container-based:**

- Container Number (e.g., MSCU1234567)
- Seal Number
- HBL Number (House Bill of Lading)
- MBL Number (Master Bill of Lading)
- Container ID (internal)

**Booking-based:**

- Airway Bill Number (AWB)
- Bill of Lading Number
- Consignment Note
- Warehouse Receipt Number
- Tracking Number
- Booking Number (blok_id)

---

## Usage Guide

### 1. Creating Container-Based Tracking (FCL)

```typescript
import {
  SeaFclTrackingModel,
  generateTrackingId,
  TrackingStatus,
} from '@/models/tracking'

async function createFclTracking(bookingId: string) {
  const tracking = await SeaFclTrackingModel.create({
    tracking_id: generateTrackingId(ServiceType.SEA_FCL, bookingId),
    blok_id: bookingId,
    service_type: ServiceType.SEA_FCL,
    user_id: 'user_123',

    current_status: TrackingStatus.BOOKING_CONFIRMED,
    booking_date: new Date(),
    estimated_delivery_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

    carrier: 'Maersk Line',
    origin: {
      name: 'Port of Shanghai',
      code: 'CNSHA',
      country: 'China',
    },
    destination: {
      name: 'JNPT Mumbai',
      code: 'INNSA',
      country: 'India',
    },

    master_bl_number: 'MAEU123456',
    vessel_name: 'MSC APOLLO',
    voyage_number: 'V123N',

    total_containers: 2,
    containers: [
      {
        container_id: 'CONT001',
        container_number: 'MSCU1234567',
        container_type: '40HC',
        weight: 20000,
        weight_unit: 'KG',
        status: TrackingStatus.BOOKING_CONFIRMED,
        milestones: [],
      },
      {
        container_id: 'CONT002',
        container_number: 'MSCU7654321',
        container_type: '40HC',
        weight: 18000,
        weight_unit: 'KG',
        status: TrackingStatus.BOOKING_CONFIRMED,
        milestones: [],
      },
    ],
    milestones: [],
    is_active: true,
  })

  return tracking
}
```

### 2. Creating Booking-Based Tracking (AIR)

```typescript
import {
  AirTrackingModel,
  generateTrackingId,
  TrackingStatus,
} from '@/models/tracking'

async function createAirTracking(bookingId: string) {
  const tracking = await AirTrackingModel.create({
    tracking_id: generateTrackingId(ServiceType.AIR, bookingId),
    blok_id: bookingId,
    service_type: ServiceType.AIR,
    user_id: 'user_123',

    current_status: TrackingStatus.BOOKING_CONFIRMED,
    booking_date: new Date(),
    estimated_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),

    carrier: 'Emirates SkyCargo',
    origin: {
      name: 'Dubai Airport',
      code: 'DXB',
      country: 'UAE',
    },
    destination: {
      name: 'Delhi Airport',
      code: 'DEL',
      country: 'India',
    },

    identifiers: {
      airway_bill_number: 'AWB-176-12345678',
      tracking_number: 'EK-TRK-987654',
    },

    package_type: 'Pallets',
    total_packages: 5,
    total_weight: 1500,
    weight_unit: 'KG',

    flight_number: 'EK-512',
    flight_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),

    milestones: [],
    is_active: true,
  })

  return tracking
}
```

### 3. Adding Milestones

```typescript
import {
  addMilestoneToTracking,
  createMilestone,
  MilestoneType,
} from '@/models/tracking'

// Add milestone to booking
await addMilestoneToTracking(
  'SFCL-ABC123-XYZ',
  createMilestone(
    MilestoneType.DEPARTED,
    TrackingStatus.IN_TRANSIT,
    'Vessel departed from Shanghai',
    {
      name: 'Port of Shanghai',
      code: 'CNSHA',
      country: 'China',
    }
  )
)

// Add milestone to specific container
import { addMilestoneToContainer } from '@/models/tracking'

await addMilestoneToContainer(
  'SFCL-ABC123-XYZ',
  'CONT001',
  createMilestone(
    MilestoneType.CUSTOMS_CLEARED,
    TrackingStatus.CUSTOMS_CLEARANCE,
    'Container cleared by customs'
  )
)
```

### 4. Searching for Tracking

```typescript
import { findTrackingByIdentifier } from '@/models/tracking'

// Search by any identifier
const tracking = await findTrackingByIdentifier('MSCU1234567')
// Works with: tracking_id, blok_id, container_number,
// BL numbers, AWB numbers, etc.
```

### 5. Getting User Trackings

```typescript
import { getUserTrackings, getTrackingSummary } from '@/models/tracking'

// Get all trackings for a user
const trackings = await getUserTrackings('user_123', {
  status: TrackingStatus.IN_TRANSIT,
  is_active: true,
})

// Get dashboard summary
const summary = await getTrackingSummary('user_123')
console.log(summary)
// {
//   total_shipments: 25,
//   active_shipments: 15,
//   in_transit: 10,
//   delivered: 8,
//   delayed: 2,
//   on_hold: 0
// }
```

### 6. Container-Specific Operations

```typescript
import { getContainerByNumber } from '@/models/tracking'

// Get container details
const result = await getContainerByNumber('MSCU1234567')

if (result) {
  console.log('Container:', result.container.container_number)
  console.log('Status:', result.container.status)
  console.log('Tracking:', result.tracking.tracking_id)
  console.log('Booking:', result.tracking.blok_id)
}
```

---

## API Reference

### Utility Functions

#### `generateTrackingId(serviceType, blokId)`

Generates a unique tracking ID with service-specific prefix.

#### `createMilestone(type, status, description, location?, notes?, createdBy?)`

Creates a milestone object with timestamp.

#### `addMilestoneToTracking(trackingId, milestone)`

Adds a milestone to the tracking record and updates status.

#### `addMilestoneToContainer(trackingId, containerId, milestone)`

Adds a milestone to a specific container.

#### `updateTrackingStatus(trackingId, status, milestone?)`

Updates the current status of tracking.

#### `findTrackingByIdentifier(identifier)`

Searches for tracking by any identifier (tracking_id, container_number, BL, AWB, etc.).

#### `getUserTrackings(userId, filters?)`

Gets all trackings for a user with optional filters.

#### `getBookingTrackings(blokId)`

Gets all tracking records for a booking.

#### `getContainerByNumber(containerNumber)`

Finds a container and its tracking by container number.

#### `calculateTrackingProgress(status)`

Returns progress percentage (0-100) based on status.

#### `getEstimatedDaysRemaining(tracking)`

Calculates days remaining until estimated delivery.

#### `isTrackingDelayed(tracking)`

Checks if tracking is past estimated delivery date.

#### `getTrackingSummary(userId)`

Gets dashboard summary statistics for a user.

---

## Database Indexes

The tracking system includes optimized indexes for fast queries:

```typescript
// Main indexes
tracking_id (unique)
blok_id
user_id
current_status
is_active

// Compound indexes
{ user_id: 1, current_status: 1 }
{ blok_id: 1, service_type: 1 }
{ carrier: 1, is_active: 1 }

// Container-specific indexes
'containers.container_number'
'containers.hbl_number'
'containers.mbl_number'
master_bl_number
house_bl_number

// Booking-specific indexes
'identifiers.airway_bill_number'
'identifiers.bill_of_lading_number'
'identifiers.consignment_note'
'identifiers.tracking_number'
```

---

## Integration with Confirmed Quotes

The tracking system links to bookings via `blok_id`:

```typescript
// When a confirmed quote is created, create tracking
import { ConfirmedQuoteModel } from '@/models/confirmed-quote'
import { createFclTracking } from './tracking-helpers'

// After booking is confirmed
const confirmedQuote = await ConfirmedQuoteModel.create({...})
const tracking = await createFclTracking(confirmedQuote.blok_id)
```

---

## Best Practices

1. **Always create tracking when booking is confirmed**
   - Use the booking's `blok_id` as the reference

2. **Update milestones in chronological order**
   - Each milestone automatically updates the current status

3. **For FCL services, track individual containers**
   - Update container-specific milestones when needed
   - Booking-level milestones track overall shipment

4. **For LCL/Air/Land, track at booking level**
   - Single set of milestones for the entire shipment

5. **Use appropriate identifiers**
   - FCL: Container numbers, BL numbers
   - Air: AWB numbers
   - Land: Consignment notes
   - LCL: BL numbers

6. **Keep estimated delivery dates updated**
   - Helps with delay detection and customer communication

7. **Mark tracking inactive when complete**
   - Status DELIVERED automatically sets `is_active: false`

---

## Type Guards

Use type guards to safely handle different tracking types:

```typescript
import { isContainerTracking, isBookingTracking } from '@/models/tracking'

if (isContainerTracking(tracking)) {
  // Access container-specific fields
  console.log('Total Containers:', tracking.total_containers)
  tracking.containers.forEach((container) => {
    console.log(container.container_number)
  })
}

if (isBookingTracking(tracking)) {
  // Access booking-specific fields
  console.log('AWB:', tracking.identifiers.airway_bill_number)
  console.log('Flight:', tracking.flight_number)
}
```

---

## Examples

See `tracking-examples.ts` for comprehensive examples including:

- Creating different types of tracking
- Updating with milestones
- Searching and filtering
- Complete workflow examples
- Dashboard integration

---

## Support

For questions or issues with the tracking system, please refer to:

- `tracking-types.ts` - Type definitions
- `tracking.ts` - Mongoose schemas
- `tracking-utils.ts` - Utility functions
- `tracking-examples.ts` - Usage examples
