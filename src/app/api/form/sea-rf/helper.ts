import { inSeaRfTrucking, usSeaRfTrucking } from '../helper/trucking'

/**
 *
 * @param distance: number in km
 * @param temperature: number in °C
 * @param humidity: number in %
 * @returns number in USD
 */
export function calculateOriginGensetCharge(params: {
  distance: number
  temperature: number
  humidity?: number
}): number {
  console.log('__Calculate Origin Genset Charge__')
  console.log({ params })
  const { distance, temperature } = params
  const gensetRatePerDay = temperature > 12 ? 60 : 85
  const distancePerDay = distance / 150
  if (distancePerDay <= 2) {
    console.log('genset rate per day * 2', gensetRatePerDay * 2)
    return gensetRatePerDay * 2
  }
  console.log('genset rate per day * 3', gensetRatePerDay * 3)
  return gensetRatePerDay * 3
}

/**
 *
 * @param distance: number in km
 * @param temperature: number in °C
 * @param humidity: number in %
 * @returns number in USD
 */
export function calculateDestinationGensetCharge(params: {
  distance: number
  temperature?: number
  humidity?: number
}): number {
  console.log('__Calculate Destination Genset Charge__')
  console.log({ params })
  const { distance } = params
  const gensetRatePerDay = 250
  const distancePerDay = distance / 150

  if (distancePerDay <= 2) {
    console.log('genset rate per day * 2', gensetRatePerDay * 2)
    return gensetRatePerDay * 2
  }
  console.log('genset rate per day * 3', gensetRatePerDay * 3)
  return gensetRatePerDay * 3
}

export async function getSeaRfTruckingCost({
  country,
  start,
  end,
  MetricTon,
  stuffingTimes,
}: {
  country: string
  start: { lat: number; lng: number }
  end: { lat: number; lng: number }
  MetricTon: number
  stuffingTimes?: number
}): Promise<{ cost: number; estimatedDays: number; distance: number }> {
  if (country == 'IN') {
    return await inSeaRfTrucking({
      start_latitude: start.lat,
      start_longitude: start.lng,
      end_latitude: end.lat,
      end_longitude: end.lng,
      ton: MetricTon,
      times: stuffingTimes,
    })
  } else {
    return await usSeaRfTrucking({
      start_latitude: start.lat,
      start_longitude: start.lng,
      end_latitude: end.lat,
      end_longitude: end.lng,
    })
  }
}
