'use client'

import {
  ContainerTracking,
  TrackingStatus,
  MilestoneType,
  ContainerDetails,
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
  Thermometer,
  AlertTriangle,
} from 'lucide-react'
import { TrackingTimeline } from './tracking-timeline'

export default function ContainerTrackerComp(props: {
  tracking: ContainerTracking
}) {
  const { tracking } = props

  // Helper function to get status color
  const getStatusColor = (status: TrackingStatus) => {
    switch (status) {
      case TrackingStatus.DELIVERED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case TrackingStatus.IN_TRANSIT:
      case TrackingStatus.OUT_FOR_DELIVERY:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case TrackingStatus.BOOKING_PENDING:
      case TrackingStatus.CARGO_READY:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case TrackingStatus.ON_HOLD:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case TrackingStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case TrackingStatus.CUSTOMS_CLEARANCE:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
  const getContainerTimelineEvents = (container: ContainerDetails) => {
    return container.milestones.map((milestone, index) => ({
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

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Container className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            {tracking.service_type.replace(/_/g, ' ')} Container Tracking
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
                  className={`${getStatusColor(tracking.current_status)} border-0`}
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
        {tracking.containers.map((container, index) => {
          const containerTimelineEvents = getContainerTimelineEvents(container)

          return (
            <Card key={container.container_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Container #{index + 1}:{' '}
                    {container.container_number || container.container_id}
                  </CardTitle>
                  <Badge
                    className={`${getStatusColor(container.status)} border-0`}
                  >
                    {container.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Container Identifiers */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-3 text-sm font-semibold">Identifiers</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">
                        Container ID
                      </p>
                      <p className="font-mono text-sm font-semibold">
                        {container.container_id}
                      </p>
                    </div>
                    {container.container_number && (
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          Container Number
                        </p>
                        <p className="font-mono text-sm font-semibold">
                          {container.container_number}
                        </p>
                      </div>
                    )}
                    {container.seal_number && (
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          Seal Number
                        </p>
                        <p className="font-mono text-sm font-semibold">
                          {container.seal_number}
                        </p>
                      </div>
                    )}
                    {container.hbl_number && (
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          House B/L Number
                        </p>
                        <p className="font-mono text-sm font-semibold">
                          {container.hbl_number}
                        </p>
                      </div>
                    )}
                    {container.mbl_number && (
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          Master B/L Number
                        </p>
                        <p className="font-mono text-sm font-semibold">
                          {container.mbl_number}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Container Info */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Type</p>
                    <Badge variant="outline">{container.container_type}</Badge>
                  </div>
                  {container.weight && (
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Weight
                      </p>
                      <p className="font-semibold">
                        {container.weight} {container.weight_unit || 'KG'}
                      </p>
                    </div>
                  )}
                  {container.volume && (
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Volume
                      </p>
                      <p className="font-semibold">
                        {container.volume} {container.volume_unit || 'CBM'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Special Indicators */}
                {(container.is_hazardous ||
                  container.temperature !== undefined ||
                  container.is_oversized) && (
                  <div className="flex flex-wrap gap-2">
                    {container.is_hazardous && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Dangerous Goods{' '}
                        {container.dg_class && `(${container.dg_class})`}
                      </Badge>
                    )}
                    {container.temperature !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        <Thermometer className="mr-1 h-3 w-3" />
                        Reefer ({container.temperature}°C)
                        {container.humidity !== undefined &&
                          ` / ${container.humidity}% humidity`}
                      </Badge>
                    )}
                    {container.is_oversized && (
                      <Badge variant="secondary" className="text-xs">
                        <PackageIcon className="mr-1 h-3 w-3" />
                        Oversized
                      </Badge>
                    )}
                  </div>
                )}

                {/* Cargo Description */}
                {container.cargo_description && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="mb-1 text-sm text-muted-foreground">
                      Cargo Description
                    </p>
                    <p className="text-sm">{container.cargo_description}</p>
                  </div>
                )}

                {/* Container Timeline */}
                {containerTimelineEvents.length > 0 && (
                  <div>
                    <h4 className="mb-4 font-semibold">
                      Container Tracking Timeline
                    </h4>
                    <TrackingTimeline events={containerTimelineEvents} />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
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
