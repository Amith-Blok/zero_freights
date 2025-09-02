import { ALL_COUNTRIES } from '@/constants'
import { GoogleLocationResponse } from '@/types/google'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParam = request.nextUrl.searchParams
  const query = searchParam.get('query')
  const country = searchParam.get('country')

  try {
    if (!query && !ALL_COUNTRIES.includes(country as any)) {
      return NextResponse.json({ items: [] })
    }
    const countryParam =
      country == 'EU'
        ? 'locationrestriction=rectangle:36.0,-25.0|71.185,60.0'
        : `components=country:${country}`
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? ''
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&${countryParam}&key=${GOOGLE_API_KEY}`
    )
    const result = (await response.json()) as GoogleLocationResponse
    const data = result.predictions
    return NextResponse.json({ items: data }, { status: 200 })
  } catch (error) {
    console.log({ error, location: 'error occur at /api/autos/google' })
    return NextResponse.json({ items: [], error }, { status: 500 })
  }
}
