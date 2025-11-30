# 🚀 Welcome to the Zero Freights Tracking System

This directory contains a complete tracking system implementation for your freight forwarding application.

## 📚 What You Have

A comprehensive tracking system that handles **13 service types** with two distinct tracking approaches:

### Container-Based Tracking (5 services)

- **SEA_FCL** - Full Container Load
- **SEA_DG** - Dangerous Goods
- **SEA_RF** - Reefer (Temperature Controlled)
- **SEA_IG** - In-Gauge Special Equipment
- **SEA_OOG** - Out of Gauge (Oversized)

Each booking can have **multiple containers**, and each container is tracked individually.

### Booking-Based Tracking (8 services)

- **SEA_LCL** - Less than Container Load
- **AIR** - Air Freight
- **DOMESTIC_TRUCKING** - Domestic Road Transport
- **SEAPORT_TRUCKING** - Port to Door Trucking
- **AIRPORT_TRUCKING** - Airport to Door Trucking
- **FCL_WAR** - FCL Warehouse
- **LCL_WAR** - LCL Warehouse
- **LTL_WAR** - LTL Warehouse

Each booking is tracked as a **single unit**.

---

## 📂 Files Overview

### Core Implementation Files (Use These)

| File                  | Purpose                     | Use For                       |
| --------------------- | --------------------------- | ----------------------------- |
| **tracking-types.ts** | TypeScript type definitions | Understanding data structures |
| **tracking.ts**       | Mongoose schemas & models   | Database models               |
| **tracking-utils.ts** | Helper functions & queries  | Common operations             |
| **index.ts**          | Main exports                | Importing into your app       |

### Documentation Files (Read These)

| File                            | Purpose                     | Best For                   |
| ------------------------------- | --------------------------- | -------------------------- |
| **QUICK_START.md**              | Quick reference guide       | Fast implementation        |
| **README.md**                   | Comprehensive documentation | Deep understanding         |
| **ARCHITECTURE.md**             | System design & structure   | Understanding how it works |
| **IMPLEMENTATION_CHECKLIST.md** | Step-by-step implementation | Following along            |

### Example Files (Learn From These)

| File                     | Purpose                 |
| ------------------------ | ----------------------- |
| **tracking-examples.ts** | Practical code examples |

---

## 🎯 Quick Start (5 Minutes)

### 1. Import What You Need

```typescript
import {
  // Models for creating tracking
  SeaFclTrackingModel,
  AirTrackingModel,

  // Types
  TrackingStatus,
  MilestoneType,

  // Utilities
  generateTrackingId,
  createMilestone,
  addMilestoneToTracking,
  findTrackingByIdentifier,
} from '@/models/tracking'
```

### 2. Create Container-Based Tracking (FCL)

```typescript
const tracking = await SeaFclTrackingModel.create({
  tracking_id: generateTrackingId(ServiceType.SEA_FCL, bookingId),
  blok_id: bookingId,
  service_type: ServiceType.SEA_FCL,
  user_id: userId,
  current_status: TrackingStatus.BOOKING_CONFIRMED,
  booking_date: new Date(),
  carrier: 'Maersk Line',
  origin: { name: 'Shanghai Port', code: 'CNSHA', country: 'China' },
  destination: { name: 'Mumbai Port', code: 'INNSA', country: 'India' },
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
  ],
  milestones: [],
  is_active: true,
})
```

### 3. Create Booking-Based Tracking (AIR)

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
  identifiers: {
    airway_bill_number: 'AWB-176-12345678',
  },
  package_type: 'Pallets',
  total_packages: 5,
  flight_number: 'EK-512',
  milestones: [],
  is_active: true,
})
```

### 4. Add Updates

```typescript
// Add milestone
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.DEPARTED,
    TrackingStatus.IN_TRANSIT,
    'Shipment departed from origin'
  )
)
```

### 5. Search Tracking

```typescript
// Customer enters any identifier
const tracking = await findTrackingByIdentifier('MSCU1234567')
// Works with: tracking_id, container_number, BL, AWB, etc.
```

---

## 🗺️ Documentation Navigation Guide

### I'm New to the System

→ Start with **QUICK_START.md**
→ Then read **README.md** sections 1-3

### I Need to Understand the Architecture

→ Read **ARCHITECTURE.md**
→ Review **tracking-types.ts** for data structures

### I'm Ready to Implement

→ Follow **IMPLEMENTATION_CHECKLIST.md**
→ Reference **tracking-examples.ts** for code samples

### I Need Specific Examples

→ Check **tracking-examples.ts**
→ Use **QUICK_START.md** for common scenarios

### I'm Stuck on Something

→ Search **README.md** for the topic
→ Check **ARCHITECTURE.md** for design decisions
→ Review type definitions in **tracking-types.ts**

---

## 🎓 Key Concepts

### 1. Two Tracking Models

**Container Tracking** (for FCL services)

- Multiple containers per booking
- Each container tracked individually
- Use: `SeaFclTrackingModel`, `SeaDgTrackingModel`, etc.

**Booking Tracking** (for LCL, Air, Land)

- Single shipment unit
- Track entire booking
- Use: `AirTrackingModel`, `SeaLclTrackingModel`, etc.

### 2. Identifiers

**Container Services Use:**

- Container Number (MSCU1234567)
- HBL Number (House Bill of Lading)
- MBL Number (Master Bill of Lading)
- Seal Number

**Booking Services Use:**

- Airway Bill Number (Air)
- Bill of Lading (LCL)
- Consignment Note (Land)
- Tracking Number (General)

### 3. Status Flow

```
BOOKING_CONFIRMED → CARGO_READY → IN_TRANSIT →
CUSTOMS_CLEARANCE → OUT_FOR_DELIVERY → DELIVERED
```

### 4. Milestones

Key events tracked throughout the journey:

- BOOKING_CREATED
- CARGO_RECEIVED
- LOADED
- DEPARTED
- ARRIVED
- CUSTOMS_CLEARED
- DELIVERED

---

## ⚡ Common Operations

### Create Tracking When Booking is Confirmed

```typescript
// After ConfirmedQuote is created
const tracking = await createTrackingFromBooking(confirmedQuote)
```

### Update Shipment Status

```typescript
await addMilestoneToTracking(
  trackingId,
  createMilestone(
    MilestoneType.ARRIVED,
    TrackingStatus.IN_TRANSIT,
    'Arrived at destination port',
    { name: 'Mumbai Port', country: 'India' }
  )
)
```

### Customer Tracks Shipment

```typescript
const tracking = await findTrackingByIdentifier(customerInput)
// Returns tracking with all details
```

### Get User Dashboard Data

```typescript
const summary = await getTrackingSummary(userId)
// Returns: total_shipments, active, in_transit, delivered, delayed
```

---

## 🔧 Integration Points

### 1. With Confirmed Quotes

```
Confirmed Quote → creates → Tracking
(via blok_id)
```

### 2. Customer Portal

```
Customer Search → findTrackingByIdentifier() → Display Status
```

### 3. Operations Dashboard

```
List Active → getUserTrackings() → Show All Shipments
```

### 4. Notifications

```
Add Milestone → Trigger Email/SMS → Notify Customer
```

---

## 📊 What Each File Contains

### tracking-types.ts

- `TrackingStatus` enum (BOOKING_CONFIRMED, IN_TRANSIT, etc.)
- `MilestoneType` enum (DEPARTED, ARRIVED, etc.)
- `ContainerTracking` interface
- `BookingTracking` interface
- Type guards: `isContainerTracking()`, `isBookingTracking()`

### tracking.ts

- Mongoose schemas
- Database models for all 13 service types
- Discriminators for container vs booking tracking
- Index definitions

### tracking-utils.ts

- `generateTrackingId()` - Create unique tracking ID
- `createMilestone()` - Create milestone object
- `addMilestoneToTracking()` - Add milestone to tracking
- `addMilestoneToContainer()` - Add milestone to container
- `findTrackingByIdentifier()` - Search by any identifier
- `getUserTrackings()` - Get all user's trackings
- `getTrackingSummary()` - Get dashboard summary
- And more utility functions...

### tracking-examples.ts

- Complete code examples for all scenarios
- FCL tracking creation
- Air tracking creation
- LCL tracking creation
- Milestone updates
- Container updates
- Search examples
- Dashboard examples

---

## 🚀 Next Steps

### Immediate (Today)

1. Read **QUICK_START.md**
2. Try examples from **tracking-examples.ts**
3. Create a test tracking record

### Short Term (This Week)

1. Follow **IMPLEMENTATION_CHECKLIST.md**
2. Integrate with your confirmed quote flow
3. Create basic API endpoints
4. Build simple tracking search page

### Medium Term (This Month)

1. Build full customer tracking portal
2. Add milestone update interface
3. Implement notifications
4. Add dashboard widgets

### Long Term (Next Month+)

1. Carrier API integrations
2. Real-time updates
3. Analytics dashboard
4. Mobile app integration

---

## 💡 Pro Tips

1. **Always link to booking**: Use `blok_id` from confirmed quote
2. **Use type guards**: Check if container or booking tracking
3. **Generate IDs**: Use `generateTrackingId()` for unique IDs
4. **Search flexibility**: `findTrackingByIdentifier()` works with any identifier
5. **Automatic timestamps**: Milestones get timestamps automatically
6. **Status updates**: Adding milestone updates `current_status` automatically

---

## 🆘 Need Help?

### For Implementation Questions

→ Check **IMPLEMENTATION_CHECKLIST.md**

### For Code Examples

→ See **tracking-examples.ts**

### For Understanding Concepts

→ Read **README.md**

### For System Design

→ Review **ARCHITECTURE.md**

### For Quick Reference

→ Use **QUICK_START.md**

---

## ✅ Verify Installation

Run this to verify everything is set up:

```typescript
import { ShipmentTrackingModel, generateTrackingId } from '@/models/tracking'

// Test 1: Can generate tracking ID
const testId = generateTrackingId(ServiceType.SEA_FCL, 'TEST123')
console.log('✓ Tracking ID generated:', testId)

// Test 2: Can access models
console.log('✓ Models loaded:', ShipmentTrackingModel.modelName)

// Test 3: Can create tracking (optional - needs DB connection)
// const test = await SeaFclTrackingModel.create({...})
// console.log('✓ Database working')
```

---

## 📈 Features Included

✅ Container-level tracking (FCL, DG, RF, IG, OOG)
✅ Booking-level tracking (LCL, Air, Land, Warehouse)
✅ Milestone/event tracking
✅ Multiple identifier support
✅ Fast search with indexes
✅ Type-safe TypeScript
✅ Mongoose models with discriminators
✅ Helper utilities
✅ Comprehensive examples
✅ Full documentation
✅ Implementation guide
✅ Architecture documentation

---

## 🎉 You're All Set!

You now have a production-ready tracking system for all 13 service types.

**Recommended reading order:**

1. This file (you're here! ✓)
2. QUICK_START.md
3. Try examples from tracking-examples.ts
4. Follow IMPLEMENTATION_CHECKLIST.md
5. Reference README.md as needed

**Happy tracking! 🚢✈️🚚**
