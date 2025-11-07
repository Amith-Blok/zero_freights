'use client'

import type React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrackingTimeline } from './tracking-timeline'
import { TrackingDetails } from './tracking-details'
import { CheckCircle2, Clock, Package, Ship } from 'lucide-react'

// Mock data for demonstration
const mockTrackingData: Record<string, any> = {
  BK001234: {
    bookingNumber: 'BK001234',
    containerNumber: 'CONT-2024-001',
    origin: 'Shanghai, China',
    destination: 'Los Angeles, USA',
    status: 'In Transit',
    estimatedDelivery: '2025-11-15',
    carrier: 'Global Shipping Lines',
    vessel: 'GSL Pacific Express',
    weight: '18,500 kg',
    contents: 'Electronics & Components',
    timeline: [
      {
        id: 1,
        status: 'Booking Confirmed',
        date: '2025-10-20',
        time: '09:30 AM',
        location: 'Shanghai Port',
        completed: true,
        icon: CheckCircle2,
      },
      {
        id: 2,
        status: 'Container Loaded',
        date: '2025-10-22',
        time: '02:15 PM',
        location: 'Shanghai Port',
        completed: true,
        icon: Package,
      },
      {
        id: 3,
        status: 'Vessel Departed',
        date: '2025-10-23',
        time: '06:00 AM',
        location: 'Shanghai Port',
        completed: true,
        icon: Ship,
      },
      {
        id: 4,
        status: 'In Transit',
        date: '2025-11-05',
        time: '10:45 AM',
        location: 'Pacific Ocean',
        completed: true,
        icon: Ship,
      },
      {
        id: 5,
        status: 'Port of Arrival',
        date: '2025-11-12',
        time: '08:30 AM',
        location: 'Los Angeles Port',
        completed: false,
        icon: Clock,
      },
      {
        id: 6,
        status: 'Customs Clearance',
        date: '2025-11-13',
        time: 'Pending',
        location: 'Los Angeles Port',
        completed: false,
        icon: Clock,
      },
      {
        id: 7,
        status: 'Delivery',
        date: '2025-11-15',
        time: 'Estimated',
        location: 'Destination',
        completed: false,
        icon: CheckCircle2,
      },
    ],
  },
}

export function TrackingDetailsComp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your booking number to track your container in real-time
          </p>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Tracking Details Card */}
          <TrackingDetails data={mockTrackingData.BK001234} />

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Timeline</CardTitle>
              <CardDescription>
                Complete journey of your container
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrackingTimeline events={mockTrackingData.BK001234.timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
