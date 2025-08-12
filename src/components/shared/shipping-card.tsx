'use client'

import { useState, useTransition } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Info,
  Ship,
  Home,
  Anchor,
  Train,
  Plane,
  Factory,
  Truck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { inFormater } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import {
  Location,
  LocationType,
  OfferModeTypes,
  ServiceType,
} from '@/models/offer/shared-types'
import { PdfType } from '@/types/common'
import { QuotePdfDownloadBtn } from '@/app/download/_component/quote-pdf-download-btn'

interface ShippingCardProps {
  lineName: string
  id: string
  containerType: string
  containerLabel: string
  transportMode: string
  modeType: OfferModeTypes
  portToDays: number
  serviceType: ServiceType
  tags: string[]
  locations: Location[]
  price: number
  children: React.ReactNode
  url: string
  offerId: string
}

const LocationIcon = ({ type }: { type: LocationType }) => {
  if (type == 'door') return <Home className="h-4 w-4 text-gray-500" />
  else if (type == 'port') return <Anchor className="h-4 w-4 text-zinc-600" />
  else if (type == 'rail') return <Train className="h-4 w-4 text-zinc-600" />
  else if (type == 'air') return <Plane className="h-4 w-4 text-zinc-600" />
  else if (type == 'warehouse')
    return <Factory className="h-4 w-4 text-zinc-600" />
}
const ModeIcon = ({ mode }: { mode: OfferModeTypes }) => {
  if (mode == 'WAR') return <Factory className="h-5 w-5 text-zinc-600" />
  else if (mode == 'AIR') return <Plane className="h-5 w-5 text-zinc-600" />
  else if (mode == 'SEA_FCL' || mode == 'SEA_LCL')
    return <Ship className="h-5 w-5 text-zinc-600" />
  else if (mode == 'LAND') return <Truck className="h-5 w-5 text-zinc-600" />
}

const RouteDisplay = ({
  locations,
  // deliveryType,
}: {
  locations: Location[]
  // deliveryType: DeliveryType
}) => {
  return (
    <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:items-center">
      {locations.map((location, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <LocationIcon type={location.type} />
            <div className="text-sm">
              <div className="font-medium text-gray-700">{location.code}</div>
              {location.name && (
                <div className="text-xs text-gray-500">{location.name}</div>
              )}
            </div>
          </div>
          {index < locations.length - 1 && (
            <div className="mx-0 my-1 flex flex-col items-center lg:mx-2 lg:my-0 lg:flex-row">
              <div className="h-5 w-5 border-l-2 border-dashed border-gray-300 lg:h-0 lg:w-5 lg:border-l-0 lg:border-t-2"></div>
              <div className="mx-1 my-1 hidden h-2 w-2 rounded-full bg-zinc-600 lg:block"></div>
              <div className="h-5 w-5 border-l-2 border-dashed border-gray-300 lg:h-0 lg:w-5 lg:border-l-0 lg:border-t-2"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ShippingCard({
  lineName,
  id,
  containerType,
  modeType,
  portToDays,
  serviceType,
  tags,
  locations,
  price,
  url,
  children,
}: ShippingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, startTransition] = useTransition()
  const router = useRouter()
  const handleSubmit = (line: string) => {
    // console.log("handleSubmit")
    // console.log("fetchUrl",url,line)
    startTransition(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_name: line,
          container_type: containerType,
          offer_id: id,
        }),
      })
      // Check for HTTP errors
      if (!response.ok) {
        // console.log({ message: 'Failed to fetch', status: response.status })
        const errorResponse = await response.json()
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: errorResponse.error,
        })
        return
      }
      const result = await response.json()
      if (result.confirmed_quote_id) {
        router.push(`/confirmed-quote/${result.confirmed_quote_id}`)
      }
      // console.log({ result });
    })
  }

  return (
    <Card className="mx-auto w-full max-w-6xl border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <div className="flex-1">
            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
              <ModeIcon mode={modeType} />
              <h3 className="text-lg font-semibold text-gray-900">
                {lineName}
              </h3>
              <QuotePdfDownloadBtn
                id={id}
                type={PdfType.OFFER}
                lineName={lineName}
              />
            </div>

            {/* Transport Info */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-gray-600">
              <Badge variant="secondary" className="bg-zinc-50 text-zinc-700">
                {serviceType.toUpperCase()}
              </Badge>
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-green-200 text-green-700"
                >
                  {tag}
                </Badge>
              ))}
              {portToDays != 0 && (
                <span className="text-sm">
                  Est. {portToDays.toString()} days port-to-port
                </span>
              )}
              <Info className="h-4 w-4 text-gray-400" />
            </div>

            {/* Route Display */}
            <RouteDisplay locations={locations} />

            {/* Expandable Content */}
            {isExpanded && children && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">{children}</div>
            )}

            {/* View More Button */}
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
              className="mt-3 flex items-center space-x-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700"
            >
              View {isExpanded ? 'less' : 'more'}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Price and Select Button */}
          <div className="flex flex-row items-center justify-between gap-3 border-t pt-4 lg:ml-6 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
            <div className="text-left lg:text-right">
              <div className="text-2xl font-bold text-gray-900">
                {inFormater.format(price)}
              </div>
            </div>
            <Button
              onClick={() => handleSubmit(lineName.toLowerCase())}
              disabled={loading}
              className="h-8 shrink-0 gap-1"
              size="sm"
            >
              {loading ? (
                <span className="animate-pulse">Booking...</span>
              ) : (
                <span>Book Now</span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
