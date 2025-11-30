# Tracking System Architecture

## 📐 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FREIGHT TRACKING SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─── Links to Confirmed Quote (blok_id)
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐          ┌──────▼───────┐
        │  CONTAINER-     │          │   BOOKING-   │
        │  BASED          │          │   BASED      │
        │  TRACKING       │          │   TRACKING   │
        └───────┬────────┘          └──────┬───────┘
                │                           │
        ┌───────┴────────┐          ┌──────┴───────────────┐
        │                │          │                      │
    ┌───▼────┐    ┌─────▼──────┐   │   ┌──────┐  ┌──────┐│
    │ SEA_FCL│    │  SEA_DG    │   │   │ AIR  │  │ LCL  ││
    │        │    │  SEA_RF    │   │   │ LAND │  │ WAR  ││
    │        │    │  SEA_IG    │   │   │TRUCK │  │      ││
    └────────┘    │  SEA_OOG   │   │   └──────┘  └──────┘│
                  └────────────┘   └────────────────────────┘
                        │                     │
                        │                     │
            ┌───────────▼──────┐   ┌─────────▼────────┐
            │  Multiple        │   │  Single          │
            │  Containers      │   │  Booking Unit    │
            │  Each tracked    │   │                  │
            │  individually    │   │                  │
            └──────────────────┘   └──────────────────┘
```

---

## 🗂️ Data Models Structure

### Base Tracking Schema (Common to All)

```
┌──────────────────────────────────────────────────────┐
│               BASE TRACKING                          │
├──────────────────────────────────────────────────────┤
│ tracking_id         : string (unique)                │
│ blok_id            : string (booking reference)      │
│ service_type       : ServiceType enum                │
│ user_id            : string                          │
│ current_status     : TrackingStatus                  │
│ booking_date       : Date                            │
│ estimated_delivery : Date                            │
│ actual_delivery    : Date                            │
│ carrier            : string                          │
│ carrier_reference  : string                          │
│ origin             : TrackingLocation                │
│ destination        : TrackingLocation                │
│ milestones[]       : TrackingMilestone[]             │
│ is_active          : boolean                         │
└──────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼──────────┐        ┌──────────▼──────────┐
│  CONTAINER       │        │   BOOKING           │
│  TRACKING        │        │   TRACKING          │
├──────────────────┤        ├─────────────────────┤
│ master_bl_number │        │ identifiers{}       │
│ house_bl_number  │        │ package_type        │
│ vessel_name      │        │ total_packages      │
│ voyage_number    │        │ total_weight        │
│ containers[]     │        │ flight_number       │
│ total_containers │        │ truck_number        │
│                  │        │ warehouse_location  │
└──────────────────┘        └─────────────────────┘
```

### Container Details Structure

```
┌────────────────────────────────────────────────┐
│         CONTAINER DETAILS                      │
├────────────────────────────────────────────────┤
│ Identifiers:                                   │
│   ├─ container_id       (internal)             │
│   ├─ container_number   (physical: MSCU123..)  │
│   ├─ seal_number                               │
│   ├─ hbl_number                                │
│   └─ mbl_number                                │
│                                                │
│ Physical:                                      │
│   ├─ container_type     (40HC, 20STD, etc)     │
│   ├─ weight / weight_unit                      │
│   ├─ volume / volume_unit                      │
│   └─ cargo_description                         │
│                                                │
│ Tracking:                                      │
│   ├─ status             (per container)        │
│   └─ milestones[]       (container history)    │
│                                                │
│ Special Handling:                              │
│   ├─ is_hazardous       (DG)                   │
│   ├─ dg_class           (DG)                   │
│   ├─ temperature        (RF)                   │
│   ├─ humidity           (RF)                   │
│   └─ is_oversized       (OOG/IG)               │
└────────────────────────────────────────────────┘
```

### Booking Identifiers Structure

```
┌────────────────────────────────────────────────┐
│         BOOKING IDENTIFIERS                    │
├────────────────────────────────────────────────┤
│ airway_bill_number        (AIR)                │
│ bill_of_lading_number     (SEA_LCL)            │
│ consignment_note          (LAND)               │
│ warehouse_receipt_number  (WAREHOUSE)          │
│ tracking_number           (GENERAL)            │
└────────────────────────────────────────────────┘
```

---

## 🔄 Tracking Status Flow

```
BOOKING_CONFIRMED
       │
       ▼
   CARGO_READY ──────────────────┐
       │                         │
       ▼                         │
   IN_TRANSIT ◄──────────────────┤
       │                         │
       ├────────► CUSTOMS_CLEARANCE
       │                │
       │                ▼
       │         OUT_FOR_DELIVERY
       │                │
       └────────────────┴────────► DELIVERED


   Special States:
   - ON_HOLD (pause at any stage)
   - CANCELLED (terminate tracking)
```

---

## 📊 Milestone Types Timeline

```
  BOOKING      CARGO       LOADED      DEPARTED      IN_TRANSIT      ARRIVED
  CREATED      RECEIVED
     │            │           │           │              │              │
     └────────────┴───────────┴───────────┴──────────────┴──────────────┤
                                                                        │
     ┌──────────────────────────────────────────────────────────────────┘
     │
     │
     ▼
  CUSTOMS      CUSTOMS      UNLOADED    OUT_FOR_      DELIVERED
  SUBMITTED    CLEARED                  DELIVERY
     │            │           │           │              │
     └────────────┴───────────┴───────────┴──────────────┘
```

---

## 🎯 Service Type Classification

### Container-Based Services (5 types)

```
┌─────────────────────────────────────────────────────┐
│ SEA_FCL  │ Standard full container load             │
├──────────┼─────────────────────────────────────────┤
│ SEA_DG   │ Dangerous goods containers              │
│          │ + dg_class, is_hazardous                │
├──────────┼─────────────────────────────────────────┤
│ SEA_RF   │ Reefer (temperature controlled)         │
│          │ + temperature, humidity                 │
├──────────┼─────────────────────────────────────────┤
│ SEA_IG   │ In-gauge special equipment              │
│          │ + is_oversized                          │
├──────────┼─────────────────────────────────────────┤
│ SEA_OOG  │ Out of gauge (oversized)                │
│          │ + is_oversized                          │
└──────────┴─────────────────────────────────────────┘
```

### Booking-Based Services (8 types)

```
┌──────────────────────┬────────────────────────────┐
│ SEA_LCL              │ Less than container load   │
│                      │ + vessel, voyage, BL       │
├──────────────────────┼────────────────────────────┤
│ AIR                  │ Air freight                │
│                      │ + flight, AWB              │
├──────────────────────┼────────────────────────────┤
│ DOMESTIC_TRUCKING    │ Domestic road transport    │
│ SEAPORT_TRUCKING     │ Port to door trucking      │
│ AIRPORT_TRUCKING     │ Airport to door trucking   │
│                      │ + truck, driver info       │
├──────────────────────┼────────────────────────────┤
│ FCL_WAR              │ FCL Warehouse              │
│ LCL_WAR              │ LCL Warehouse              │
│ LTL_WAR              │ LTL Warehouse              │
│                      │ + warehouse location       │
└──────────────────────┴────────────────────────────┘
```

---

## 🔍 Search & Index Strategy

### Primary Indexes

```
┌─────────────────────────────────────────────────┐
│ Fast Lookup Indexes                             │
├─────────────────────────────────────────────────┤
│ tracking_id         (UNIQUE)                    │
│ blok_id             (INDEX)                     │
│ user_id             (INDEX)                     │
│ current_status      (INDEX)                     │
│ is_active           (INDEX)                     │
└─────────────────────────────────────────────────┘
```

### Compound Indexes

```
┌─────────────────────────────────────────────────┐
│ Optimized Query Combinations                    │
├─────────────────────────────────────────────────┤
│ { user_id, current_status }                     │
│ { blok_id, service_type }                       │
│ { carrier, is_active }                          │
└─────────────────────────────────────────────────┘
```

### Identifier Indexes (Container Tracking)

```
┌─────────────────────────────────────────────────┐
│ Container Search Fields                         │
├─────────────────────────────────────────────────┤
│ containers.container_number                     │
│ containers.hbl_number                           │
│ containers.mbl_number                           │
│ master_bl_number                                │
│ house_bl_number                                 │
└─────────────────────────────────────────────────┘
```

### Identifier Indexes (Booking Tracking)

```
┌─────────────────────────────────────────────────┐
│ Booking Search Fields                           │
├─────────────────────────────────────────────────┤
│ identifiers.airway_bill_number                  │
│ identifiers.bill_of_lading_number               │
│ identifiers.consignment_note                    │
│ identifiers.warehouse_receipt_number            │
│ identifiers.tracking_number                     │
└─────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (Discriminators)

```
Collection: shipment_tracking

┌────────────────────────────────────────────────┐
│ Base Document (All records)                    │
│ discriminatorKey: 'tracking_type'              │
└────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────┐        ┌───────▼─────────┐
│ tracking_type│        │  tracking_type  │
│ = CONTAINER_ │        │  = BOOKING_     │
│   SEA_FCL    │        │     SEA_LCL     │
│   SEA_DG     │        │     AIR         │
│   SEA_RF     │        │     DOMESTIC_..  │
│   SEA_IG     │        │     etc...      │
│   SEA_OOG    │        │                 │
└──────────────┘        └─────────────────┘
```

---

## 🔗 Integration Points

### 1. Confirmed Quote → Tracking

```
┌─────────────────────┐
│ Confirmed Quote     │
│ (Booking Model)     │
│                     │
│ blok_id: "BLOK123"  │
│ service_type: FCL   │
└──────────┬──────────┘
           │
           │ When booking confirmed
           │
           ▼
┌─────────────────────┐
│ Create Tracking     │
│                     │
│ blok_id: "BLOK123"  │
│ tracking_id: auto   │
└─────────────────────┘
```

### 2. Customer Portal Integration

```
Customer enters: "MSCU1234567"
           │
           ▼
    findTrackingByIdentifier()
           │
           ├─ Search tracking_id
           ├─ Search blok_id
           ├─ Search container_number
           ├─ Search BL numbers
           ├─ Search AWB numbers
           └─ Search other identifiers
           │
           ▼
    Return tracking record
           │
           ▼
    Display:
      - Current status
      - Location
      - Milestones timeline
      - Estimated delivery
      - Container details (if FCL)
```

### 3. Real-time Updates

```
External System (Carrier API, Port System)
           │
           ▼
    Update Handler
           │
           ├─ Parse event data
           ├─ Map to milestone type
           └─ Create location info
           │
           ▼
    addMilestoneToTracking()
           │
           ├─ Add to milestones[]
           ├─ Update current_status
           └─ Trigger notifications
           │
           ▼
    Notify Customer
      - Email
      - SMS
      - Push notification
      - WebSocket update
```

---

## 📦 Module Structure

```
src/models/tracking/
│
├── tracking-types.ts          # TypeScript interfaces & enums
├── tracking.ts                # Mongoose schemas & models
├── tracking-utils.ts          # Helper functions & queries
├── tracking-examples.ts       # Code examples
├── index.ts                   # Main exports
│
├── README.md                  # Full documentation
├── QUICK_START.md            # Quick reference
└── ARCHITECTURE.md           # This file
```

---

## 🚀 Usage Flow

### Creating Tracking

```
1. User confirms quote
   └─> Confirmed Quote created (blok_id generated)

2. Create tracking record
   └─> Call SeaFclTrackingModel.create() or AirTrackingModel.create()
       ├─ tracking_id: auto-generated
       ├─ blok_id: from confirmed quote
       ├─ service_type: from booking
       ├─ containers: if FCL (with container_numbers)
       └─ identifiers: if booking-based (AWB, BL, etc)

3. Initial milestone
   └─> BOOKING_CREATED milestone added automatically
```

### Updating Status

```
Event occurs (cargo loaded, departed, etc)
   │
   ▼
createMilestone()
   ├─ milestone_type: LOADED
   ├─ status: IN_TRANSIT
   ├─ description: "Containers loaded"
   └─ location: { name, code, country }
   │
   ▼
addMilestoneToTracking(trackingId, milestone)
   ├─ Adds to milestones array
   ├─ Updates current_status
   └─ Timestamp added automatically
```

### Container-Specific Updates (FCL only)

```
Container event occurs
   │
   ▼
addMilestoneToContainer(trackingId, containerId, milestone)
   ├─ Finds specific container
   ├─ Adds to container.milestones[]
   └─ Updates container.status
```

---

## 💡 Design Decisions

### Why Two Tracking Models?

1. **Container-Based (FCL)**
   - Multiple containers per booking
   - Each container needs individual tracking
   - Different containers may have different statuses
   - Customer may query specific container

2. **Booking-Based (LCL, Air, etc)**
   - Single shipment unit
   - No need to track individual items
   - Simpler data structure
   - More efficient queries

### Why Discriminators?

- Single collection for all tracking
- Efficient queries across all service types
- Type-specific fields only where needed
- Easier to maintain and query

### Why Embedded Containers?

- Containers always queried with parent tracking
- No need for separate collection
- Atomic updates
- Better performance for typical queries

---

## 🔐 Security Considerations

### Access Control

```
User can access tracking if:
  - tracking.user_id === userId
  - User is admin/operator
  - User has booking access (via blok_id)
```

### Data Visibility

```
Public tracking page:
  ✓ Current status
  ✓ Location
  ✓ Milestones
  ✓ Estimated delivery

  ✗ Pricing information
  ✗ User details
  ✗ Internal notes
```

---

## 📈 Performance Considerations

### Indexes

- All frequently queried fields indexed
- Compound indexes for common queries
- Text indexes for search if needed

### Query Optimization

- Limit milestone arrays (archive old ones if needed)
- Use projection to fetch only needed fields
- Implement pagination for list queries

### Scalability

- Sharding by user_id or tracking_id
- Archive completed trackings after N days
- Separate hot/cold data storage

---

## 🧪 Testing Strategy

### Unit Tests

- Milestone creation
- Status transitions
- Identifier generation
- Type guards

### Integration Tests

- Create tracking flow
- Update milestones
- Search functionality
- Container-specific updates

### End-to-End Tests

- Complete booking to delivery flow
- Customer tracking queries
- Real-time updates
- Notifications

---

## 📊 Monitoring & Analytics

### Key Metrics

- Average delivery time by service type
- On-time delivery percentage
- Exception rate
- Tracking queries per day
- Active shipments by status

### Alerts

- Shipments past estimated delivery
- Stuck in customs > X days
- No updates in > Y days
- Exception milestones

---

This architecture supports your 13 service types with appropriate tracking granularity for each type!
