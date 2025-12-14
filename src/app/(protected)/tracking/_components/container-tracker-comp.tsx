'use client'

import {
  ContainerTracking,
  TrackingStatus,
  MilestoneType,
  // ContainerDetails,
  TrackingMilestone,
} from '@/models/tracking/tracking-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Calendar,
  PackageIcon,
  Ship,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  FileText,
  Container,
  // Thermometer,
  // AlertTriangle,
} from 'lucide-react'
import { TrackingTimeline } from './tracking-timeline'
import { TrackingServiceTypeMapper } from '@/constants/tracking'

export default function ContainerTrackerComp(props: {
  tracking: ContainerTracking
}) {
  const { tracking } = props

  // Helper function to get status color and hover styles
  const getStatusColor = (status: TrackingStatus) => {
    switch (status) {
      case TrackingStatus.DELIVERED:
        // Subtle hover: bg-emerald-50 -> bg-emerald-100 (light) / bg-emerald-900 -> bg-emerald-800 (dark)
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-800'

      case TrackingStatus.IN_TRANSIT:
      case TrackingStatus.OUT_FOR_DELIVERY:
        // Subtle hover: bg-sky-50 -> bg-sky-100 (light) / bg-sky-900 -> bg-sky-800 (dark)
        return 'bg-sky-50 text-sky-700 dark:bg-sky-900 dark:text-sky-100 hover:bg-sky-100 dark:hover:bg-sky-800'

      case TrackingStatus.BOOKING_PENDING:
        // Changed to Stone for better distinction from Default Gray
        return 'bg-stone-50 text-stone-700 dark:bg-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'

      case TrackingStatus.CARGO_READY:
        // Subtle hover: bg-amber-50 -> bg-amber-100 (light) / bg-amber-900 -> bg-amber-800 (dark)
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800'

      case TrackingStatus.ON_HOLD:
        // Subtle hover: bg-orange-50 -> bg-orange-100 (light) / bg-orange-900 -> bg-orange-800 (dark)
        return 'bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-100 hover:bg-orange-100 dark:hover:bg-orange-800'

      case TrackingStatus.CANCELLED:
        // Subtle hover: bg-rose-50 -> bg-rose-100 (light) / bg-rose-900 -> bg-rose-800 (dark)
        return 'bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-100 hover:bg-rose-100 dark:hover:bg-rose-800'

      case TrackingStatus.CUSTOMS_CLEARANCE:
        // Subtle hover: bg-indigo-50 -> bg-indigo-100 (light) / bg-indigo-900 -> bg-indigo-800 (dark)
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 hover:bg-indigo-100 dark:hover:bg-indigo-800'

      default:
        // Subtle hover: bg-gray-50 -> bg-gray-100 (light) / bg-gray-900 -> bg-gray-800 (dark)
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
  }

  // Helper function to get icon for milestone
  const getMilestoneIcon = (milestone: MilestoneType) => {
    switch (milestone) {
      case MilestoneType.BOOKING_CREATED:
        return CheckCircle2
      case MilestoneType.CARGO_RECEIVED:
        return Package
      case MilestoneType.LOADED:
        return PackageIcon
      case MilestoneType.DEPARTED:
      case MilestoneType.IN_TRANSIT:
        return Ship
      case MilestoneType.ARRIVED:
        return MapPin
      case MilestoneType.CUSTOMS_SUBMITTED:
      case MilestoneType.CUSTOMS_CLEARED:
        return FileText
      case MilestoneType.UNLOADED:
        return Package
      case MilestoneType.OUT_FOR_DELIVERY:
        return Ship
      case MilestoneType.DELIVERED:
        return CheckCircle2
      case MilestoneType.EXCEPTION:
        return AlertCircle
      default:
        return Clock
    }
  }

  // Transform milestones to timeline events (for booking level)
  const bookingTimelineEvents = tracking.milestones.map((milestone, index) => ({
    id: index + 1,
    status: milestone.milestone_type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    date: new Date(milestone.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: new Date(milestone.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    location: milestone.location
      ? `${milestone.location.name}, ${milestone.location.country}`
      : 'N/A',
    completed: true,
    icon: getMilestoneIcon(milestone.milestone_type),
  }))

  // Add estimated future milestones if not delivered
  if (
    tracking.current_status !== TrackingStatus.DELIVERED &&
    tracking.estimated_delivery_date
  ) {
    bookingTimelineEvents.push({
      id: bookingTimelineEvents.length + 1,
      status: 'Estimated Delivery',
      date: new Date(tracking.estimated_delivery_date).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      ),
      time: 'Estimated',
      location: `${tracking.destination.name}, ${tracking.destination.country}`,
      completed: false,
      icon: CheckCircle2,
    })
  }

  // Helper function to transform container milestones to timeline events
  const getContainerTimelineEvents = (milestones: TrackingMilestone[]) => {
    return milestones.map((milestone, index) => ({
      id: index + 1,
      status: milestone.milestone_type
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      date: new Date(milestone.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: new Date(milestone.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      location: milestone.location
        ? `${milestone.location.name}, ${milestone.location.country}`
        : 'N/A',
      completed: true,
      icon: getMilestoneIcon(milestone.milestone_type),
    }))
  }

  const timelineEvents = getContainerTimelineEvents(tracking.milestones)
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Container className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            {TrackingServiceTypeMapper[tracking.service_type]} Tracking
          </h2>
        </div>
        <p className="text-muted-foreground">
          Complete tracking information for your containerized shipment
        </p>
      </div>

      {/* Main Details Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">
                  Tracking ID
                </p>
                <p className="font-mono text-lg font-semibold">
                  {tracking.tracking_id}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Booking ID</p>
                <p className="font-mono font-semibold">{tracking.booking_id}</p>
              </div>
              {tracking.master_bl_number && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Master B/L Number
                  </p>
                  <p className="font-mono font-semibold">
                    {tracking.master_bl_number}
                  </p>
                </div>
              )}
              {tracking.house_bl_number && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    House B/L Number
                  </p>
                  <p className="font-mono font-semibold">
                    {tracking.house_bl_number}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-1 text-sm text-muted-foreground">
                  Current Status
                </p>
                <Badge
                  className={`${getStatusColor(tracking.current_status)} border-0 text-xs`}
                  variant={'outline'}
                >
                  {tracking.current_status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Carrier</p>
                <p className="font-semibold">{tracking.carrier}</p>
              </div>
              {tracking.carrier_reference && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Carrier Reference
                  </p>
                  <p className="font-mono text-sm">
                    {tracking.carrier_reference}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-1 text-sm text-muted-foreground">
                  Total Containers
                </p>
                <p className="text-lg font-semibold">
                  {tracking.total_containers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-semibold">{tracking.origin.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tracking.origin.city && `${tracking.origin.city}, `}
                    {tracking.origin.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-semibold">{tracking.destination.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tracking.destination.city &&
                      `${tracking.destination.city}, `}
                    {tracking.destination.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-semibold">
                    {new Date(tracking.booking_date).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
              {tracking.estimated_delivery_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Estimated Delivery
                    </p>
                    <p className="font-semibold">
                      {new Date(
                        tracking.estimated_delivery_date
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
              {tracking.actual_delivery_date && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Actual Delivery
                    </p>
                    <p className="font-semibold">
                      {new Date(
                        tracking.actual_delivery_date
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vessel & Port Information */}
      {(tracking.vessel_name ||
        tracking.port_of_loading ||
        tracking.port_of_discharge) && (
        <Card>
          <CardHeader>
            <CardTitle>Vessel & Port Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {tracking.vessel_name && (
                <div className="flex items-start gap-3">
                  <Ship className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Vessel</p>
                    <p className="font-semibold">{tracking.vessel_name}</p>
                    {tracking.voyage_number && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Voyage: {tracking.voyage_number}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {tracking.port_of_loading && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Port of Loading
                    </p>
                    <p className="font-semibold">{tracking.port_of_loading}</p>
                  </div>
                </div>
              )}
              {tracking.port_of_discharge && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Port of Discharge
                    </p>
                    <p className="font-semibold">
                      {tracking.port_of_discharge}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Container Details with Tracking */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          Containers ({tracking.total_containers})
        </h3>

        <Card>
          <CardHeader>
            {/* <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Container #{tracking.total_containers}:{' '}
                    {tracking.containers[0].container_number || tracking.containers[0].container_id}
                  </CardTitle>
                  <Badge
                    className={`${getStatusColor(tracking.containers[0].status)} border-0`}
                  >
                    {tracking.containers[0].status.replace(/_/g, ' ')}
                  </Badge>
                </div> */}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Container Identifiers */}

            <div>
              <h4 className="mb-4 font-semibold">
                Container Tracking Timeline
              </h4>
              <TrackingTimeline events={timelineEvents} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Special Instructions */}
      {tracking.special_instructions && (
        <Card>
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{tracking.special_instructions}</p>
          </CardContent>
        </Card>
      )}

      {/* Overall Shipment Timeline */}
      {/* <Card>
                <CardHeader>
                    <CardTitle>Overall Shipment Timeline</CardTitle>
                    <CardDescription>Complete journey of your shipment</CardDescription>
                </CardHeader>
                <CardContent>
                    {bookingTimelineEvents.length > 0 ? (
                        <TrackingTimeline events={bookingTimelineEvents} />
                    ) : (
                        <p className="text-sm text-muted-foreground">No tracking events available yet.</p>
                    )}
                </CardContent>
            </Card> */}
    </div>
  )
}
