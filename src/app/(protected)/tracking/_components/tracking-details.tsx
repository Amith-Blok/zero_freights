import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Ship, Calendar, Weight, PackageIcon } from 'lucide-react'

interface TrackingDetailsProps {
  data: {
    bookingNumber: string
    containerNumber: string
    origin: string
    destination: string
    status: string
    estimatedDelivery: string
    carrier: string
    vessel: string
    weight: string
    contents: string
  }
}

export function TrackingDetails({ data }: TrackingDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Main Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm text-muted-foreground">
                Booking Number
              </p>
              <p className="font-mono text-lg font-semibold">
                {data.bookingNumber}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-muted-foreground">
                Container Number
              </p>
              <p className="font-mono font-semibold">{data.containerNumber}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-muted-foreground">
                Current Status
              </p>
              <Badge className={`${getStatusColor(data.status)} border-0`}>
                {data.status}
              </Badge>
            </div>
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Carrier</p>
              <p className="font-semibold">{data.carrier}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route & Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-semibold">{data.origin}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-semibold">{data.destination}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Est. Delivery</p>
                <p className="font-semibold">{data.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cargo Details */}
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Ship className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Vessel</p>
                <p className="text-sm font-semibold">{data.vessel}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Weight className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-sm font-semibold">{data.weight}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PackageIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Contents</p>
                <p className="text-sm font-semibold">{data.contents}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
