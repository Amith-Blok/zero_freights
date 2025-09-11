import { Coordinates, GeoLocationResponse } from '@/types/google'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? ''
export const getGoogleLocationByPlaceId = async (placeid: string) => {
  try {
    if (!placeid) throw new Error('Place ID is required')
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${GOOGLE_API_KEY}`
    )
    const data = (await response.json()) as GeoLocationResponse
    if (!data.result?.geometry.location) throw new Error('Location not found')
    return data.result.geometry.location
  } catch (error) {
    console.error('Error fetching geolocation:', (error as Error).message)
    throw error
  }
}

export async function calculateDistance(
  origin: Coordinates,
  destination: Coordinates
): Promise<number> {
  try {
    const distData = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`
    )
    const data = await distData.json()

    if (
      data.status === 'OK' &&
      data.rows &&
      data.rows.length > 0 &&
      data.rows[0].elements &&
      data.rows[0].elements.length > 0
    ) {
      const distance = {
        text: data.rows[0].elements[0].distance.text,
        value: data.rows[0].elements[0].distance.value,
      }
      // const duration = {
      //   text: data.rows[0].elements[0].duration.text,
      //   value: data.rows[0].elements[0].duration.value,
      // };
      //NOTE: this could mean distance very close so set minimun 5000 m distance
      if (!distance.value) return 5000

      return distance.value as number
    } else {
      throw new Error('Error fetching distance')
    }
  } catch (error) {
    console.error('Error fetching distance:', (error as Error).message)
    throw error
  }
}
