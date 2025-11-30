# Tracking System Quick Start Guide

## 🚀 Quick Implementation Guide

### Step 1: Import What You Need

```typescript
import {
  // Models
  SeaFclTrackingModel,
  AirTrackingModel,
  SeaLclTrackingModel,

  // Types
  TrackingStatus,
  MilestoneType,
  ServiceType,

  // Utilities
  generateTrackingId,
  createMilestone,
  addMilestoneToTracking,
  findTrackingByIdentifier,
} from '@/models/tracking'
```

---

## 📦 Container-Based Tracking (FCL, DG, RF, IG, OOG)

### When to Use

- When you have **individual containers** to track
- Each container has its own ID, number, seal
- Services: SEA_FCL, SEA_DG, SEA_RF, SEA_IG, SEA_OOG

### Quick Create

```typescript
const tracking = await SeaFclTrackingModel.create({
  tracking_id: generateTrackingId(ServiceType.SEA_FCL, bookingId),
  blok_id: bookingId, // Your booking reference
  service_type: ServiceType.SEA_FCL,
  user_id: userId,

  current_status: TrackingStatus.BOOKING_CONFIRMED,
  booking_date: new Date(),

  carrier: 'Maersk Line',
  origin: { name: 'Shanghai Port', code: 'CNSHA', country: 'China' },
  destination: { name: 'Mumbai Port', code: 'INNSA', country: 'India' },

  // Container list
  total_containers: 2,
  containers: [
    {
      container_id: 'CONT001',
      container_number: 'MSCU1234567', // Physical container number
      container_type: '40HC',
      weight: 20000,
      weight_unit: 'KG',
      status: TrackingStatus.BOOKING_CONFIRMED,
      milestones: [],
    },
    // ... more containers
  ],

  milestones: [],
  is_active: true,
})
```

### Update Container Status

```typescript
// Update specific container
await addMilestoneToContainer(
  tracking.tracking_id,
  'CONT001', // container_id
  createMilestone(
    MilestoneType.LOADED,
    TrackingStatus.IN_TRANSIT,
    'Container loaded onto vessel'
  )
)
```

---

## 📋 Booking-Based Tracking (LCL, AIR, LAND, Warehouse)

### When to Use

- When tracking **entire booking** as one unit
- No individual container tracking needed
- Services: SEA_LCL, AIR, DOMESTIC_TRUCKING, SEAPORT_TRUCKING, AIRPORT_TRUCKING, FCL_WAR, LCL_WAR, LTL_WAR

### Quick Create - Air Freight

```typescript
const tracking = await AirTrackingModel.create({
  tracking_id: generateTrackingId(ServiceType.AIR, bookingId),
  blok_id: bookingId,
  service_type: ServiceType.AIR,
  user_id: userId,

  current_status: TrackingStatus.BOOKING_CONFIRMED,
  booking_date: new Date(),

  carrier: 'Emirates SkyCargo',
  origin: { name: 'Dubai Airport', code: 'DXB', country: 'UAE' },
  destination: { name: 'Delhi Airport', code: 'DEL', country: 'India' },

  // Identifiers
  identifiers: {
    airway_bill_number: 'AWB-176-12345678',
    tracking_number: 'EK-TRK-987654',
  },

  // Cargo info
  package_type: 'Pallets',
  total_packages: 5,
  total_weight: 1500,
  weight_unit: 'KG',

  // Air-specific
  flight_number: 'EK-512',
  flight_date: new Date(),

  milestones: [],
  is_active: true,
})
```

### Quick Create - Sea LCL

```typescript
const tracking = await SeaLclTrackingModel.create({
  tracking_id: generateTrackingId(ServiceType.SEA_LCL, bookingId),
  blok_id: bookingId,
  service_type: ServiceType.SEA_LCL,
  user_id: userId,

  current_status: TrackingStatus.BOOKING_CONFIRMED,
  booking_date: new Date(),

  carrier: 'MSC',
  origin: { name: 'Hamburg Port', code: 'DEHAM', country: 'Germany' },
  destination: { name: 'Mumbai Port', code: 'INNSA', country: 'India' },

  identifiers: {
    bill_of_lading_number: 'MSCU-BL-2024-001',
  },

  package_type: 'Cartons',
  total_packages: 50,
  total_weight: 2500,
  weight_unit: 'KG',

  vessel_name: 'MSC AURORA',
  voyage_number: 'V456E',

  milestones: [],
  is_active: true,
})
```

---

## 📍 Adding Milestones (Events)

### Simple Milestone

```typescript
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.DEPARTED,
    TrackingStatus.IN_TRANSIT,
    'Shipment departed from origin'
  )
)
```

### Milestone with Location

```typescript
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.ARRIVED,
    TrackingStatus.IN_TRANSIT,
    'Arrived at destination port',
    {
      name: 'JNPT Mumbai',
      code: 'INNSA',
      city: 'Mumbai',
      country: 'India',
    }
  )
)
```

### Common Milestone Sequence

```typescript
// 1. Booking confirmed (automatic on create)

// 2. Cargo ready
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.CARGO_RECEIVED,
    TrackingStatus.CARGO_READY,
    'Cargo received at warehouse'
  )
)

// 3. Loaded
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.LOADED,
    TrackingStatus.IN_TRANSIT,
    'Cargo loaded onto vessel/aircraft/truck'
  )
)

// 4. Departed
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.DEPARTED,
    TrackingStatus.IN_TRANSIT,
    'Departed from origin'
  )
)

// 5. In transit (optional updates)
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.IN_TRANSIT,
    TrackingStatus.IN_TRANSIT,
    'Passing through transit point'
  )
)

// 6. Arrived
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.ARRIVED,
    TrackingStatus.IN_TRANSIT,
    'Arrived at destination port/airport'
  )
)

// 7. Customs
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.CUSTOMS_CLEARED,
    TrackingStatus.CUSTOMS_CLEARANCE,
    'Customs clearance completed'
  )
)

// 8. Out for delivery
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.OUT_FOR_DELIVERY,
    TrackingStatus.OUT_FOR_DELIVERY,
    'Out for final delivery'
  )
)

// 9. Delivered
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.DELIVERED,
    TrackingStatus.DELIVERED,
    'Delivered to customer'
  )
)
```

---

## 🔍 Searching for Tracking

### By Any Identifier

```typescript
// Works with:
// - tracking_id
// - blok_id (booking number)
// - container_number
// - MBL/HBL number
// - AWB number
// - consignment note
// - any other identifier

const tracking = await findTrackingByIdentifier('MSCU1234567')
```

### By User

```typescript
import { getUserTrackings } from '@/models/tracking'

// All trackings
const allTrackings = await getUserTrackings(userId)

// Filtered
const activeShipments = await getUserTrackings(userId, {
  is_active: true,
})

const inTransit = await getUserTrackings(userId, {
  status: TrackingStatus.IN_TRANSIT,
})
```

### By Booking

```typescript
import { getBookingTrackings } from '@/models/tracking'

const trackings = await getBookingTrackings(blokId)
```

### Container Number

```typescript
import { getContainerByNumber } from '@/models/tracking'

const result = await getContainerByNumber('MSCU1234567')
if (result) {
  console.log(result.tracking) // Full tracking record
  console.log(result.container) // Specific container details
}
```

---

## 📊 Dashboard Summary

```typescript
import { getTrackingSummary } from '@/models/tracking'

const summary = await getTrackingSummary(userId)

// Returns:
// {
//   total_shipments: 25,
//   active_shipments: 15,
//   in_transit: 10,
//   delivered: 8,
//   delayed: 2,
//   on_hold: 0
// }
```

---

## 🎯 Common Scenarios

### Scenario 1: Customer Books FCL Shipment

```typescript
// 1. Customer confirms quote → Create tracking
const tracking = await SeaFclTrackingModel.create({
  tracking_id: generateTrackingId(ServiceType.SEA_FCL, blokId),
  blok_id: blokId,
  // ... other fields
})

// 2. Send tracking ID to customer
sendEmail(customer.email, {
  subject: 'Shipment Tracking',
  trackingId: tracking.tracking_id,
  trackingUrl: `https://yourapp.com/track/${tracking.tracking_id}`,
})
```

### Scenario 2: Container Loaded at Port

```typescript
// Update booking-level status
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.LOADED,
    TrackingStatus.IN_TRANSIT,
    'All containers loaded'
  )
)

// Update each container
for (const container of containers) {
  await addMilestoneToContainer(
    trackingId,
    container.container_id,
    createMilestone(
      MilestoneType.LOADED,
      TrackingStatus.IN_TRANSIT,
      `Container ${container.container_number} loaded`
    )
  )
}
```

### Scenario 3: Customer Tracks Shipment

```typescript
// Customer enters any identifier
const identifier = 'MSCU1234567' // or tracking_id, or AWB, etc.
const tracking = await findTrackingByIdentifier(identifier)

if (!tracking) {
  return { error: 'Tracking not found' }
}

// Return tracking info with progress
return {
  tracking_id: tracking.tracking_id,
  status: tracking.current_status,
  origin: tracking.origin,
  destination: tracking.destination,
  estimated_delivery: tracking.estimated_delivery_date,
  milestones: tracking.milestones.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ),
}
```

### Scenario 4: Air Freight with Real-time Updates

```typescript
// Create air tracking
const tracking = await AirTrackingModel.create({...})

// Flight departure
await addMilestoneToTracking(trackingId, createMilestone(
  MilestoneType.DEPARTED,
  TrackingStatus.IN_TRANSIT,
  `Flight ${tracking.flight_number} departed from ${tracking.origin.name}`
))

// Flight arrival
await addMilestoneToTracking(trackingId, createMilestone(
  MilestoneType.ARRIVED,
  TrackingStatus.IN_TRANSIT,
  `Flight ${tracking.flight_number} arrived at ${tracking.destination.name}`
))
```

---

## ⚠️ Important Notes

1. **Always use `blok_id`** - This links tracking to your booking/confirmed quote

2. **Container ID vs Container Number**:
   - `container_id`: Your internal ID (e.g., 'CONT001')
   - `container_number`: Physical container number (e.g., 'MSCU1234567')

3. **Status Updates**: When you add a milestone, the tracking's `current_status` is automatically updated

4. **Delivered Status**: Automatically sets `is_active: false` and records `actual_delivery_date`

5. **Type Safety**: Use type guards when working with mixed tracking types:
   ```typescript
   if (isContainerTracking(tracking)) {
     // Access container-specific fields
   }
   ```

---

## 🔗 Service Type → Model Mapping

| Service Type      | Model                         | Tracking Type |
| ----------------- | ----------------------------- | ------------- |
| SEA_FCL           | SeaFclTrackingModel           | Container     |
| SEA_DG            | SeaDgTrackingModel            | Container     |
| SEA_RF            | SeaRfTrackingModel            | Container     |
| SEA_IG            | SeaIgTrackingModel            | Container     |
| SEA_OOG           | SeaOogTrackingModel           | Container     |
| SEA_LCL           | SeaLclTrackingModel           | Booking       |
| AIR               | AirTrackingModel              | Booking       |
| DOMESTIC_TRUCKING | DomesticTruckingTrackingModel | Booking       |
| SEAPORT_TRUCKING  | SeaportTruckingTrackingModel  | Booking       |
| AIRPORT_TRUCKING  | AirportTruckingTrackingModel  | Booking       |
| FCL_WAR           | FclWarehouseTrackingModel     | Booking       |
| LCL_WAR           | LclWarehouseTrackingModel     | Booking       |
| LTL_WAR           | LtlWarehouseTrackingModel     | Booking       |

---

## 📚 More Resources

- **Full Documentation**: See `README.md`
- **Type Definitions**: See `tracking-types.ts`
- **Complete Examples**: See `tracking-examples.ts`
- **Utility Functions**: See `tracking-utils.ts`

---

## 💡 Pro Tips

1. **Unique Tracking IDs**: Use `generateTrackingId()` - it creates service-specific prefixes
2. **Timestamps**: All milestones automatically get current timestamp
3. **Location Data**: Add coordinates for map visualization
4. **Search**: All identifiers are indexed for fast searching
5. **Dashboard**: Use `getTrackingSummary()` for user dashboard widgets
