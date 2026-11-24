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
import { Search } from 'lucide-react'
import { getTrackingByUserAndIdentifierAction } from '@/actions/tracking'
import { useRouter } from 'next/navigation'

export function TrackingSearch(params: { userId: string }) {
  const [bookingNumber, setBookingNumber] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedBooking = bookingNumber.trim().toUpperCase()

    if (!trimmedBooking) {
      setError('Please enter a booking number')
      return
    }

    const tracking = await getTrackingByUserAndIdentifierAction({
      userId: params.userId,
      identifier: trimmedBooking,
    })
    if (tracking) {
      setError('')
      router.push(`/tracking/${tracking.tracking_id}`)
    } else {
      setError('Booking number not found. Please check the number on your Booking page (e.g. ZFBSCQ000133).')
    }
  }

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
                placeholder="e.g., ZFBSCQ000133"
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
      </div>
    </div>
  )
}
