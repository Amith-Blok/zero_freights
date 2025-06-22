import { NextRequest } from 'next/server'

import { getAllAirportByCountry } from '@/data/air-port'

import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const country = searchParams.get('country')
  // console.log('airport route country:', country);
  try {
    if (!country) {
      return NextResponse.json(
        { error: 'country is required' },
        { status: 400 }
      )
    }
    const response = await getAllAirportByCountry(country).catch((error) => {
      console.log({ error })
    })
    if (!response) {
      return NextResponse.json(
        { error: 'something went wrong couldnt fetch airport' },
        { status: 500 }
      )
    }
    return NextResponse.json({ items: response }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}
