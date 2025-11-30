# Tracking System Implementation Checklist

Use this checklist to guide your implementation of the tracking system into your Zero Freights application.

## ✅ Phase 1: Database Setup

- [ ] **Ensure MongoDB Connection**
  - Verify mongoose is connected
  - Check connection string includes database name

- [ ] **Import Tracking Models**

  ```typescript
  import { ShipmentTrackingModel } from '@/models/tracking'
  ```

- [ ] **Test Database Connection**

  ```typescript
  // Create a test tracking record
  const test = await SeaFclTrackingModel.create({...})
  console.log('Tracking system ready!')
  ```

- [ ] **Verify Indexes Created**
  - Run: `db.shipment_tracking.getIndexes()`
  - Should see indexes on tracking_id, blok_id, user_id, etc.

---

## ✅ Phase 2: Integration with Confirmed Quotes

- [ ] **Update Confirmed Quote Creation Flow**

  **File**: Wherever you create confirmed quotes

  ```typescript
  import { createTrackingFromBooking } from '@/services/tracking-service'

  // After confirmed quote is created
  const confirmedQuote = await ConfirmedQuoteModel.create({...})

  // Create tracking
  const tracking = await createTrackingFromBooking(confirmedQuote)
  ```

- [ ] **Create Helper Function**: `createTrackingFromBooking()`

  **File**: `src/services/tracking-service.ts` (create this)

  ```typescript
  export async function createTrackingFromBooking(
    confirmedQuote: ConfirmedQuote
  ) {
    const model = getTrackingModel(confirmedQuote.service_type)

    // Build tracking data based on service type
    if (isContainerServiceType(confirmedQuote.service_type)) {
      return await model.create({
        tracking_id: generateTrackingId(
          confirmedQuote.service_type,
          confirmedQuote.blok_id
        ),
        blok_id: confirmedQuote.blok_id,
        // ... map fields from confirmed quote
      })
    } else {
      // Booking-based tracking
      return await model.create({
        tracking_id: generateTrackingId(
          confirmedQuote.service_type,
          confirmedQuote.blok_id
        ),
        blok_id: confirmedQuote.blok_id,
        // ... map fields
      })
    }
  }
  ```

- [ ] **Test Integration**
  - Create a confirmed quote
  - Verify tracking is created automatically
  - Check blok_id links correctly

---

## ✅ Phase 3: API Endpoints

### [ ] **Create Tracking Endpoints**

**File**: `src/app/api/tracking/route.ts` or equivalent

#### 3.1 Search/Get Tracking

- [ ] `GET /api/tracking/:identifier`
  ```typescript
  // Search by any identifier
  const tracking = await findTrackingByIdentifier(params.identifier)
  return Response.json(tracking)
  ```

#### 3.2 Get User Trackings

- [ ] `GET /api/tracking/user/:userId`
  ```typescript
  const trackings = await getUserTrackings(userId, {
    is_active: true,
  })
  return Response.json(trackings)
  ```

#### 3.3 Get Booking Trackings

- [ ] `GET /api/tracking/booking/:blokId`
  ```typescript
  const trackings = await getBookingTrackings(blokId)
  return Response.json(trackings)
  ```

#### 3.4 Add Milestone

- [ ] `POST /api/tracking/:trackingId/milestone`
  ```typescript
  const milestone = createMilestone(
    body.milestone_type,
    body.status,
    body.description,
    body.location
  )
  await addMilestoneToTracking(trackingId, milestone)
  return Response.json({ success: true })
  ```

#### 3.5 Add Container Milestone (FCL only)

- [ ] `POST /api/tracking/:trackingId/container/:containerId/milestone`
  ```typescript
  await addMilestoneToContainer(trackingId, containerId, milestone)
  ```

#### 3.6 Dashboard Summary

- [ ] `GET /api/tracking/summary/:userId`
  ```typescript
  const summary = await getTrackingSummary(userId)
  return Response.json(summary)
  ```

### [ ] **Add Authentication Middleware**

```typescript
// Verify user owns tracking or is admin
const tracking = await findTrackingByIdentifier(identifier)
if (tracking.user_id !== session.user.id && !session.user.isAdmin) {
  return Response.json({ error: 'Unauthorized' }, { status: 403 })
}
```

### [ ] **Test All Endpoints**

- Use Postman or similar
- Test success cases
- Test error cases
- Test authentication

---

## ✅ Phase 4: Frontend Components

### [ ] **Tracking Search Component**

**File**: `src/components/tracking/TrackingSearch.tsx`

- [ ] Search input for any identifier
- [ ] Call `/api/tracking/:identifier`
- [ ] Display results

```typescript
const [identifier, setIdentifier] = useState('')
const [tracking, setTracking] = useState(null)

const handleSearch = async () => {
  const response = await fetch(`/api/tracking/${identifier}`)
  const data = await response.json()
  setTracking(data)
}
```

### [ ] **Tracking Details Component**

**File**: `src/components/tracking/TrackingDetails.tsx`

- [ ] Display current status
- [ ] Show origin/destination
- [ ] Display carrier info
- [ ] Show estimated delivery
- [ ] Progress bar based on status

```typescript
const progress = calculateTrackingProgress(tracking.current_status)

<ProgressBar value={progress} />
<Status>{tracking.current_status}</Status>
<Location>
  {tracking.origin.name} → {tracking.destination.name}
</Location>
```

### [ ] **Milestone Timeline Component**

**File**: `src/components/tracking/MilestoneTimeline.tsx`

- [ ] Display milestones in chronological order
- [ ] Show location for each milestone
- [ ] Format timestamps
- [ ] Visual timeline

```typescript
{tracking.milestones
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  .map(milestone => (
    <TimelineItem key={milestone.timestamp}>
      <Timestamp>{formatDate(milestone.timestamp)}</Timestamp>
      <Description>{milestone.description}</Description>
      {milestone.location && (
        <Location>{milestone.location.name}</Location>
      )}
    </TimelineItem>
  ))
}
```

### [ ] **Container List Component (FCL)**

**File**: `src/components/tracking/ContainerList.tsx`

- [ ] Display all containers
- [ ] Show container number
- [ ] Individual container status
- [ ] Click to see container details

```typescript
{isContainerTracking(tracking) && (
  <ContainerList>
    {tracking.containers.map(container => (
      <ContainerCard key={container.container_id}>
        <ContainerNumber>{container.container_number}</ContainerNumber>
        <ContainerType>{container.container_type}</ContainerType>
        <Status>{container.status}</Status>
      </ContainerCard>
    ))}
  </ContainerList>
)}
```

### [ ] **Dashboard Widget**

**File**: `src/components/dashboard/TrackingSummary.tsx`

- [ ] Show summary stats
- [ ] Active shipments count
- [ ] In transit count
- [ ] Delayed shipments alert
- [ ] Link to full tracking page

```typescript
const [summary, setSummary] = useState(null)

useEffect(() => {
  fetch(`/api/tracking/summary/${userId}`)
    .then(res => res.json())
    .then(setSummary)
}, [userId])

return (
  <Widget>
    <Stat label="Active" value={summary.active_shipments} />
    <Stat label="In Transit" value={summary.in_transit} />
    <Stat label="Delivered" value={summary.delivered} />
    {summary.delayed > 0 && (
      <Alert>⚠️ {summary.delayed} delayed shipments</Alert>
    )}
  </Widget>
)
```

### [ ] **Public Tracking Page**

**File**: `src/app/track/[identifier]/page.tsx`

- [ ] Public page (no auth required)
- [ ] Track by any identifier
- [ ] Show tracking details
- [ ] Share-friendly URL

```typescript
export default async function TrackPage({ params }) {
  const tracking = await findTrackingByIdentifier(params.identifier)

  if (!tracking) {
    return <NotFound />
  }

  return (
    <div>
      <TrackingDetails tracking={tracking} />
      <MilestoneTimeline tracking={tracking} />
    </div>
  )
}
```

---

## ✅ Phase 5: Milestone Management

### [ ] **Create Milestone Update Interface**

**File**: `src/app/admin/tracking/[id]/update/page.tsx`

- [ ] Form to add new milestone
- [ ] Select milestone type
- [ ] Select status
- [ ] Description input
- [ ] Location input (optional)
- [ ] Notes input (optional)

```typescript
const handleSubmit = async (data) => {
  await fetch(`/api/tracking/${trackingId}/milestone`, {
    method: 'POST',
    body: JSON.stringify({
      milestone_type: data.type,
      status: data.status,
      description: data.description,
      location: data.location,
    }),
  })
}
```

### [ ] **Container-Specific Milestone Form (FCL)**

- [ ] Select container from dropdown
- [ ] Same fields as above
- [ ] Post to container-specific endpoint

### [ ] **Bulk Milestone Update (FCL)**

- [ ] Select multiple containers
- [ ] Apply same milestone to all
- [ ] Useful for "All containers loaded" type events

---

## ✅ Phase 6: Notifications

### [ ] **Email Notifications**

**File**: `src/services/notification-service.ts`

- [ ] Template for booking confirmed
- [ ] Template for status updates
- [ ] Template for delivered
- [ ] Template for exceptions

```typescript
export async function sendTrackingUpdate(
  tracking: ShipmentTracking,
  milestone: TrackingMilestone
) {
  const user = await getUserById(tracking.user_id)

  await sendEmail({
    to: user.email,
    subject: `Shipment Update: ${milestone.description}`,
    template: 'tracking-update',
    data: {
      tracking_id: tracking.tracking_id,
      status: tracking.current_status,
      milestone,
      tracking_url: `https://yourapp.com/track/${tracking.tracking_id}`,
    },
  })
}
```

### [ ] **Trigger Notifications on Milestone Add**

```typescript
// In addMilestoneToTracking function
await sendTrackingUpdate(tracking, milestone)

// For important milestones
if (
  [
    MilestoneType.DEPARTED,
    MilestoneType.ARRIVED,
    MilestoneType.DELIVERED,
  ].includes(milestone.milestone_type)
) {
  await sendTrackingUpdate(tracking, milestone)
}
```

### [ ] **SMS Notifications (Optional)**

- [ ] For critical updates
- [ ] Delivered status
- [ ] Exception/delay alerts

### [ ] **Push Notifications (Optional)**

- [ ] If you have mobile app
- [ ] Real-time status updates

---

## ✅ Phase 7: Integrations

### [ ] **Carrier API Integration**

**File**: `src/integrations/carriers/`

- [ ] Maersk API integration
- [ ] MSC API integration
- [ ] CMA CGM API integration
- [ ] Other carriers

```typescript
// Poll carrier API for updates
export async function syncCarrierTracking(tracking: ContainerTracking) {
  const carrierData = await fetchFromCarrierAPI(
    tracking.carrier,
    tracking.master_bl_number
  )

  // Map carrier data to our milestones
  for (const event of carrierData.events) {
    const milestone = mapCarrierEventToMilestone(event)
    await addMilestoneToTracking(tracking.tracking_id, milestone)
  }
}
```

### [ ] **Scheduled Jobs**

**File**: `src/jobs/tracking-sync.ts`

- [ ] Cron job to sync carrier data
- [ ] Run every X hours
- [ ] Only for active shipments

```typescript
// Run every 6 hours
export async function syncAllTrackings() {
  const activeTrackings = await ShipmentTrackingModel.find({
    is_active: true,
    current_status: { $ne: TrackingStatus.DELIVERED },
  })

  for (const tracking of activeTrackings) {
    if (isContainerTracking(tracking)) {
      await syncCarrierTracking(tracking)
    }
  }
}
```

### [ ] **Webhook Receiver (Optional)**

**File**: `src/app/api/webhooks/tracking/route.ts`

- [ ] Receive webhooks from carriers
- [ ] Verify webhook signature
- [ ] Process event
- [ ] Update tracking

```typescript
export async function POST(request: Request) {
  const event = await request.json()

  // Verify signature
  const isValid = verifyWebhookSignature(event)
  if (!isValid)
    return Response.json({ error: 'Invalid signature' }, { status: 401 })

  // Process event
  const tracking = await findTrackingByCarrierRef(event.reference)
  const milestone = mapWebhookEventToMilestone(event)
  await addMilestoneToTracking(tracking.tracking_id, milestone)

  return Response.json({ success: true })
}
```

---

## ✅ Phase 8: Testing

### [ ] **Unit Tests**

**File**: `__tests__/tracking/utils.test.ts`

- [ ] Test `generateTrackingId()`
- [ ] Test `createMilestone()`
- [ ] Test type guards
- [ ] Test progress calculation

### [ ] **Integration Tests**

**File**: `__tests__/tracking/integration.test.ts`

- [ ] Test create tracking flow
- [ ] Test add milestone
- [ ] Test search functionality
- [ ] Test container updates

### [ ] **E2E Tests**

**File**: `__tests__/e2e/tracking.spec.ts`

- [ ] Complete booking to tracking flow
- [ ] Search from customer portal
- [ ] Milestone updates
- [ ] Email notifications

---

## ✅ Phase 9: Deployment

### [ ] **Environment Variables**

```env
MONGODB_URI=mongodb://...
CARRIER_API_KEY_MAERSK=...
CARRIER_API_KEY_MSC=...
NOTIFICATION_EMAIL_FROM=tracking@zerofreights.com
```

### [ ] **Database Indexes**

- [ ] Verify indexes created in production
- [ ] Monitor index usage
- [ ] Add additional indexes if needed

### [ ] **Monitoring**

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor API response times
- [ ] Track database query performance

### [ ] **Backups**

- [ ] Ensure tracking collection included in backups
- [ ] Test restore procedure

---

## ✅ Phase 10: Documentation & Training

### [ ] **Internal Documentation**

- [ ] How to create tracking
- [ ] How to add milestones
- [ ] How to search tracking
- [ ] API documentation

### [ ] **User Guide**

- [ ] How customers can track shipments
- [ ] What identifiers they can use
- [ ] What information is shown

### [ ] **Team Training**

- [ ] Train operations team on milestone updates
- [ ] Train support team on tracking queries
- [ ] Train developers on integration

---

## ✅ Optional Enhancements

### [ ] **Real-time Updates**

- [ ] WebSocket for live tracking
- [ ] Auto-refresh on tracking page
- [ ] Live notifications

### [ ] **Map Visualization**

- [ ] Show shipment route on map
- [ ] Current location marker
- [ ] Milestone locations

### [ ] **Analytics Dashboard**

- [ ] Average delivery time by route
- [ ] On-time delivery rate
- [ ] Exception analysis
- [ ] Carrier performance

### [ ] **Automated Exceptions**

- [ ] Auto-detect delays
- [ ] Alert on stuck shipments
- [ ] Predictive delivery dates

### [ ] **Customer Self-Service**

- [ ] Request updates
- [ ] Upload documents
- [ ] Add notes
- [ ] Subscribe to updates

### [ ] **Mobile App**

- [ ] Native tracking interface
- [ ] Push notifications
- [ ] Scan container number (QR/barcode)

---

## 📋 Go-Live Checklist

Before going live with tracking:

- [ ] All API endpoints tested
- [ ] All frontend components tested
- [ ] Notifications working
- [ ] Database indexes created
- [ ] Error handling in place
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Team trained
- [ ] Staging environment tested
- [ ] Production deployment plan ready

---

## 🚨 Common Issues & Solutions

### Issue: Tracking not created after booking

**Solution**: Check if `createTrackingFromBooking()` is called after confirmed quote creation

### Issue: Search not finding container

**Solution**: Verify container number is saved correctly with proper index

### Issue: Milestones not showing in order

**Solution**: Sort by timestamp: `.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))`

### Issue: Slow queries

**Solution**: Check if indexes are created, use `.lean()` for read-only queries

### Issue: Type errors with discriminators

**Solution**: Use type guards: `isContainerTracking()` and `isBookingTracking()`

---

## 📞 Need Help?

Refer to:

- `README.md` - Full documentation
- `QUICK_START.md` - Quick reference
- `ARCHITECTURE.md` - System design
- `tracking-examples.ts` - Code examples

---

**Good luck with your implementation! 🚀**
