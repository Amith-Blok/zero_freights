import { CardWrapper } from '@/components/shared/card-wrapper'
import {
  findTrackingByIdentifier,
  isContainerTracking,
} from '@/models/tracking'
import { getUser } from '@/lib/user'
import { notFound, redirect } from 'next/navigation'
import BookingTrackerComp from '../_components/booking-tracker-comp'
import ContainerTrackerComp from '../_components/container-tracker-comp'
import { ShipmentTracking } from '@/models/tracking/tracking-types'
import { ContainerTracking } from '@/models/tracking/tracking-types'
import { BookingTracking } from '@/models/tracking/tracking-types'

export default async function TrackingDetailsPage(props: {
  params: Promise<{ identifierId: string }>
}) {
  const params = await props.params
  const identifer = params.identifierId
  const dbUser = await getUser()
  if (!dbUser) {
    redirect('/login')
  }
  if (!identifer) {
    return notFound()
  }
  const tracking = await findTrackingByIdentifier({
    identifier: identifer,
    userId: dbUser.id,
  })
  const safeTracking = JSON.parse(JSON.stringify(tracking))
  // console.log({ tracking: JSON.stringify(tracking, null, 2) })
  if (!tracking) {
    return notFound()
  }

  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Tracking Details"
        cardDescription="View the details of your shipment"
        titleClass="text-2xl"
        cardClass="my-5  md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        {isContainerTracking(tracking as ShipmentTracking) ? (
          <ContainerTrackerComp tracking={safeTracking as ContainerTracking} />
        ) : (
          <BookingTrackerComp tracking={safeTracking as BookingTracking} />
        )}
      </CardWrapper>
    </div>
  )
}
