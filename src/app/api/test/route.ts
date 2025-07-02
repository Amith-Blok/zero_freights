import { NextRequest, NextResponse } from 'next/server'
import {
  FREIGHT_CLASS_RATES,
  US_LTL_FLAT_RATES_BY_MILES,
} from '../form/constant'

export async function GET(request: NextRequest) {
  const searchParam = request.nextUrl.searchParams
  const density = Number(searchParam.get('density'))
  const distance = Number(searchParam.get('miles'))
  if (!density || !distance) return NextResponse.json({ items: [] })

  const fileredHaulageRate = FREIGHT_CLASS_RATES.find(
    (rate) => rate.minDensity <= density
  )
  const baseTrucking = US_LTL_FLAT_RATES_BY_MILES.find(
    (rate) => rate.min <= distance && rate.max >= distance
  )

  return NextResponse.json({ fileredHaulageRate, baseTrucking })
}
