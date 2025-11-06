'use client'
import React, { ReactNode, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { inFormater, usFormater } from '@/lib/utils'

interface ConfirmedQuoteCardProps {
  id: string
  userName: string
  userEmail: string
  userPhone: string
  userCompany: string
  origin: string
  destination: string
  transitInfo: string
  total: number
  containerType: string
  carrier: string
  tag: string
  currency: 'USD' | 'INR'
  children: ReactNode
}
export function ConfirmedQuoteCard({
  id,
  userName,
  userEmail,
  userPhone,
  userCompany,
  origin,
  destination,
  containerType,
  transitInfo,
  total,
  carrier,
  tag,
  currency,
  children,
}: ConfirmedQuoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const formater = currency === 'INR' ? inFormater : usFormater
  return (
    <Card className="mb-8 w-full max-w-4xl">
      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-2 rounded-full bg-green-500"></div>
            <div>
              <span className="text-lg font-semibold text-gray-900">{id}</span>
              <p className="text-sm font-normal text-gray-500">
                Booking Reference
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-green-100 px-3 py-1 font-medium text-green-800"
          >
            ✓ Booked
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Customer Information */}
        <section className="rounded-lg p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{userName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userEmail || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{userPhone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium">{userCompany || 'N/A'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping and Pricing */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">
              Shipping Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Line:</span>
                <span className="font-medium">
                  {carrier} | {containerType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium">
                  {tag?.toUpperCase() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transit Time:</span>
                <span className="font-medium">{transitInfo}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h3 className="mb-2 font-semibold text-gray-900">Total Cost</h3>
            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-green-700">
                {formater.format(total)}
              </div>
              <p className="text-sm font-medium text-green-600">Final Quote</p>
              <p className="mt-2 text-xs text-gray-500">
                *Pricing may vary based on additional requirements
              </p>
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className="border-t pt-4">
          <h3 className="mb-2 font-semibold text-gray-900">
            Route Information
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex-1">
              <span className="text-gray-600">From:</span>
              <p className="font-medium">{origin.toUpperCase()}</p>
            </div>
            <div className="flex-1">
              <span className="text-gray-600">To:</span>
              <p className="font-medium">{destination.toUpperCase()}</p>
            </div>
          </div>

          {/* Expandable Content */}
          {isExpanded && children && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">{children}</div>
          )}

          {/* View More Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-700"
          >
            View {isExpanded ? 'less' : 'more'}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
