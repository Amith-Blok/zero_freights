import { nearestWarehouse } from '@/data/warehouses'
import { NextRequest, NextResponse } from 'next/server'
import { getGoogleLocationByPlaceId } from '../../form/helper/google-map'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const country = searchParams.get('country')
  const placeId = searchParams.get('place_id')
  try {
    if (!country || !placeId) {
      return NextResponse.json({ error: 'missing params' }, { status: 400 })
    }
    // console.log({ country, placeId })
    const { lat, lng } = await getGoogleLocationByPlaceId(placeId)
    const response = await nearestWarehouse({ country, lat: +lat, lng: +lng })
    if (!response) {
      return NextResponse.json({ items: [] })
    }
    return NextResponse.json({ items: response }, { status: 200 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ items: [] })
  }
}
