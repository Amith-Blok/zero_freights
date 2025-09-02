import { ALL_COUNTRIES } from '@/constants'
import { getNearByAirPorts } from '@/data/air-port'
import { NextRequest, NextResponse } from 'next/server'
import { getGoogleLocationByPlaceId } from '../../form/helper/google-map'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')
  const placeId = searchParams.get('place_id')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  try {
    if (country && ALL_COUNTRIES.includes(country as any) && lat && lng) {
      const response = await getNearByAirPorts(country, +lat, +lng)
      return NextResponse.json({ items: response }, { status: 200 })
    }

    if (!country || !placeId || !ALL_COUNTRIES.includes(country as any)) {
      return NextResponse.json(
        { error: 'country, place_id are required' },
        { status: 400 }
      )
    }

    const location = await getGoogleLocationByPlaceId(placeId)
    if (!location) {
      return NextResponse.json(
        { error: 'could not fetch location' },
        { status: 400 }
      )
    }
    const response = await getNearByAirPorts(
      country,
      +location.lat,
      +location.lng
    )
    return NextResponse.json({ items: response }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}
