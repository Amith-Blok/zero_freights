'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Package, Truck, Ship, CheckCircle2, Clock } from 'lucide-react'
import { TrackingTimeline } from './tracking-timeline'
import { TrackingDetails } from './tracking-details'

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
        icon: Truck,
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
  BK005678: {
    bookingNumber: 'BK005678',
    containerNumber: 'CONT-2024-002',
    origin: 'Rotterdam, Netherlands',
    destination: 'New York, USA',
    status: 'Delivered',
    estimatedDelivery: '2025-11-08',
    carrier: 'Atlantic Freight Co',
    vessel: 'Atlantic Navigator',
    weight: '22,000 kg',
    contents: 'Industrial Machinery',
    timeline: [
      {
        id: 1,
        status: 'Booking Confirmed',
        date: '2025-10-15',
        time: '11:00 AM',
        location: 'Rotterdam Port',
        completed: true,
        icon: CheckCircle2,
      },
      {
        id: 2,
        status: 'Container Loaded',
        date: '2025-10-17',
        time: '03:30 PM',
        location: 'Rotterdam Port',
        completed: true,
        icon: Package,
      },
      {
        id: 3,
        status: 'Vessel Departed',
        date: '2025-10-18',
        time: '07:00 AM',
        location: 'Rotterdam Port',
        completed: true,
        icon: Ship,
      },
      {
        id: 4,
        status: 'In Transit',
        date: '2025-10-28',
        time: '02:00 PM',
        location: 'Atlantic Ocean',
        completed: true,
        icon: Truck,
      },
      {
        id: 5,
        status: 'Port of Arrival',
        date: '2025-11-05',
        time: '09:15 AM',
        location: 'New York Port',
        completed: true,
        icon: CheckCircle2,
      },
      {
        id: 6,
        status: 'Customs Clearance',
        date: '2025-11-06',
        time: '04:45 PM',
        location: 'New York Port',
        completed: true,
        icon: CheckCircle2,
      },
      {
        id: 7,
        status: 'Delivery',
        date: '2025-11-08',
        time: '11:30 AM',
        location: 'Destination',
        completed: true,
        icon: CheckCircle2,
      },
    ],
  },
}

export function TrackingSearch() {
  const [bookingNumber, setBookingNumber] = useState('')
  const [searchedBooking, setSearchedBooking] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedBooking = bookingNumber.trim().toUpperCase()

    if (!trimmedBooking) {
      setError('Please enter a booking number')
      return
    }

    if (mockTrackingData[trimmedBooking]) {
      setSearchedBooking(trimmedBooking)
      setError('')
    } else {
      setError('Booking number not found. Try BK001234 or BK005678')
      setSearchedBooking(null)
    }
  }

  const trackingData = searchedBooking
    ? mockTrackingData[searchedBooking]
    : null

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

        {/* Search Form */}
        <Card className="mx-auto mb-8 max-w-2xl">
          <CardHeader>
            <CardTitle>Booking Search</CardTitle>
            <CardDescription>
              Enter your booking number to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="e.g., BK001234"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="lg" className="gap-2">
                <Search className="h-4 w-4" />
                Track
              </Button>
            </form>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Tracking Details Card */}
            <TrackingDetails data={trackingData} />

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment Timeline</CardTitle>
                <CardDescription>
                  Complete journey of your container
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrackingTimeline events={trackingData.timeline} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!trackingData && !error && (
          <Card className="mx-auto max-w-2xl py-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Enter a booking number above to view tracking information
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
