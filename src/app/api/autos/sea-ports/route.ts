import {
  getAllSeaPortsByCountry,
  getNearestSeaPortsByCountry,
} from '@/data/sea-ports'
import mongoosedb from '@/lib/mongoose-db'
import { NextRequest, NextResponse } from 'next/server'
import { getGoogleLocationByPlaceId } from '../../form/helper/google-map'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const country = searchParams.get('country')
  const placeId = searchParams.get('place_id')
  const mode = searchParams.get('mode')
  const isPort = mode == 'LCL' ? true : false
  try {
    if (!country) {
      return NextResponse.json(
        { error: 'missing param country' },
        { status: 400 }
      )
    }
    await mongoosedb()
    if (!placeId) {
      const response = await getAllSeaPortsByCountry(country)

      return NextResponse.json({ items: response }, { status: 200 })
    }

    const location = await getGoogleLocationByPlaceId(placeId)
    if (!location) {
      return NextResponse.json({ error: 'invalid locationId' }, { status: 400 })
    }
    const response = await getNearestSeaPortsByCountry({
      country,
      lat: location.lat,
      lng: location.lng,
      isPort,
    })

    return NextResponse.json({ items: response }, { status: 200 })
  } catch (error) {
    console.log({ error })
    return NextResponse.json(
      { error: 'something went wrong', items: [] },
      { status: 500 }
    )
  }
}
