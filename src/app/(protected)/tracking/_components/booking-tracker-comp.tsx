'use client'

import {
  BookingTracking,
  TrackingStatus,
  MilestoneType,
} from '@/models/tracking/tracking-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Calendar,
  Weight,
  PackageIcon,
  Plane,
  Truck,
  Ship,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  FileText,
  Warehouse,
} from 'lucide-react'
import { TrackingTimeline } from './tracking-timeline'
import { ServiceType } from '@/models/offer/shared-types'

export default function BookingTrackerComp(props: {
  tracking: BookingTracking
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
        if (tracking.service_type === ServiceType.AIR) return Plane
        if (
          [
            ServiceType.DOMESTIC_TRUCKING,
            ServiceType.SEAPORT_TRUCKING,
            ServiceType.AIRPORT_TRUCKING,
          ].includes(tracking.service_type)
        )
          return Truck
        return Ship
      case MilestoneType.ARRIVED:
        return MapPin
      case MilestoneType.CUSTOMS_SUBMITTED:
      case MilestoneType.CUSTOMS_CLEARED:
        return FileText
      case MilestoneType.UNLOADED:
        return Package
      case MilestoneType.OUT_FOR_DELIVERY:
        return Truck
      case MilestoneType.DELIVERED:
        return CheckCircle2
      case MilestoneType.EXCEPTION:
        return AlertCircle
      default:
        return Clock
    }
  }

  // Helper function to get service icon
  const getServiceIcon = () => {
    if (tracking.service_type === ServiceType.AIR) return Plane
    if (
      [
        ServiceType.DOMESTIC_TRUCKING,
        ServiceType.SEAPORT_TRUCKING,
        ServiceType.AIRPORT_TRUCKING,
      ].includes(tracking.service_type)
    )
      return Truck
    if (tracking.service_type === ServiceType.SEA_LCL) return Ship
    if (
      [ServiceType.FCL_WAR, ServiceType.LCL_WAR, ServiceType.LTL_WAR].includes(
        tracking.service_type
      )
    )
      return Warehouse
    return Package
  }

  // Transform milestones to timeline events
  const timelineEvents = tracking.milestones.map((milestone, index) => ({
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
    timelineEvents.push({
      id: timelineEvents.length + 1,
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

  const ServiceIcon = getServiceIcon()

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <ServiceIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            {tracking.service_type.replace(/_/g, ' ')} Tracking
          </h2>
        </div>
        <p className="text-muted-foreground">
          Complete tracking information for your shipment
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
              {tracking.identifiers.tracking_number && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Tracking Number
                  </p>
                  <p className="font-mono font-semibold">
                    {tracking.identifiers.tracking_number}
                  </p>
                </div>
              )}
              {tracking.identifiers.airway_bill_number && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Airway Bill Number
                  </p>
                  <p className="font-mono font-semibold">
                    {tracking.identifiers.airway_bill_number}
                  </p>
                </div>
              )}
              {tracking.identifiers.bill_of_lading_number && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Bill of Lading Number
                  </p>
                  <p className="font-mono font-semibold">
                    {tracking.identifiers.bill_of_lading_number}
                  </p>
                </div>
              )}
              {tracking.identifiers.consignment_note && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Consignment Note
                  </p>
                  <p className="font-mono font-semibold">
                    {tracking.identifiers.consignment_note}
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

      {/* Cargo Details */}
      <Card>
        <CardHeader>
          <CardTitle>Cargo Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tracking.total_weight && (
              <div className="flex items-start gap-3">
                <Weight className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total Weight</p>
                  <p className="text-lg font-semibold">
                    {tracking.total_weight} {tracking.weight_unit || 'KG'}
                  </p>
                </div>
              </div>
            )}
            {tracking.total_volume && (
              <div className="flex items-start gap-3">
                <PackageIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-lg font-semibold">
                    {tracking.total_volume} {tracking.volume_unit || 'CBM'}
                  </p>
                </div>
              </div>
            )}
            {tracking.total_packages && (
              <div className="flex items-start gap-3">
                <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Total Packages
                  </p>
                  <p className="text-lg font-semibold">
                    {tracking.total_packages}
                  </p>
                </div>
              </div>
            )}
          </div>

          {tracking.package_type && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-muted-foreground">Package Type</p>
              <Badge variant="outline">{tracking.package_type}</Badge>
            </div>
          )}

          {tracking.cargo_description && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Cargo Description
              </p>
              <p className="text-sm">{tracking.cargo_description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service-Specific Information */}
      {(tracking.flight_number ||
        tracking.vessel_name ||
        tracking.truck_number ||
        tracking.driver_info ||
        tracking.warehouse_location) && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {tracking.flight_number && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Flight Number
                  </p>
                  <p className="font-semibold">{tracking.flight_number}</p>
                  {tracking.flight_date && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(tracking.flight_date).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  )}
                </div>
              )}
              {tracking.vessel_name && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Vessel</p>
                  <p className="font-semibold">{tracking.vessel_name}</p>
                  {tracking.voyage_number && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Voyage: {tracking.voyage_number}
                    </p>
                  )}
                </div>
              )}
              {tracking.truck_number && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Truck Number
                  </p>
                  <p className="font-semibold">{tracking.truck_number}</p>
                </div>
              )}
              {tracking.driver_info && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Driver Information
                  </p>
                  <p className="font-semibold">{tracking.driver_info.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tracking.driver_info.phone}
                  </p>
                  {tracking.driver_info.license_number && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      License: {tracking.driver_info.license_number}
                    </p>
                  )}
                </div>
              )}
              {tracking.warehouse_location && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Warehouse Location
                  </p>
                  <p className="font-semibold">{tracking.warehouse_location}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Timeline</CardTitle>
          <CardDescription>Complete journey of your shipment</CardDescription>
        </CardHeader>
        <CardContent>
          {timelineEvents.length > 0 ? (
            <TrackingTimeline events={timelineEvents} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No tracking events available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
