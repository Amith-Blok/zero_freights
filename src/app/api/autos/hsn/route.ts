import { hsnAutoCompleteByQuery } from '@/data/hsn'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParam = request.nextUrl.searchParams
  const query = searchParam.get('query')

  try {
    if (!query) {
      return NextResponse.json({ items: [] })
    }
    const response = await hsnAutoCompleteByQuery(query)

    return NextResponse.json({ items: response }, { status: 200 })
  } catch (error) {
    console.log({ error, location: 'error occur at /api/autos/hsn' })
    return NextResponse.json({ items: [], error }, { status: 500 })
  }
}
