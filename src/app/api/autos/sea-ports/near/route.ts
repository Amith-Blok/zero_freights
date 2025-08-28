import { neartestSeaPortFromRail } from '@/data/sea-ports'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const country = searchParams.get('country')
  const haulageType = searchParams.get('haulage')
  const portCode = searchParams.get('port')
  try {
    if (!country || !haulageType || !portCode) {
      return NextResponse.json(
        {
          error: 'missing param country',
          country,
          haulage_type: haulageType,
          port: portCode,
        },
        { status: 400 }
      )
    }

    const response = await neartestSeaPortFromRail({
      country,
      portCode: portCode,
      haulageType,
    })
    if (response) {
      return NextResponse.json(
        { items: response.nearest_ports },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { items: [], error: 'No ports found for the given criteria.' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.log({ error })
    return NextResponse.json(
      { items: [], error: 'something went wrong' },
      { status: 500 }
    )
  }
}
