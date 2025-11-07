import React from 'react'
import { CardWrapper } from '@/components/shared/card-wrapper'
import { TrackingDetailsComp } from '../_components/tracking-details-comp'

export default async function TrackingDetailsPage(props: {
  params: Promise<{ trackingId: string }>
}) {
  const params = await props.params
  const trackingId = params.trackingId
  console.log({ trackingId })
  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Tracking Details"
        cardDescription="View the details of your shipment"
        titleClass="text-2xl"
        cardClass="my-5  md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        <TrackingDetailsComp />
      </CardWrapper>
    </div>
  )
}
