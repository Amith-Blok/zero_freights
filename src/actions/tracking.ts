'use server'
import { getTrackingByUserAndIdentifier } from '@/data/tracking'
import { ShipmentTracking } from '@/models/tracking'

export async function getTrackingByUserAndIdentifierAction(params: {
  userId: string
  identifier: string
}): Promise<ShipmentTracking | null> {
  const { userId, identifier } = params
  try {
    const tracking = await getTrackingByUserAndIdentifier(userId, identifier)
    return tracking
  } catch (error) {
    console.error('Error fetching tracking by user and identifier:', error)
    return null
  }
}
