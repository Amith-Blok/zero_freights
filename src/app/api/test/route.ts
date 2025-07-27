import { NextRequest, NextResponse } from 'next/server'
import { getDutyByHsCodeCountry } from '@/data/duties'

export async function GET(_: NextRequest) {
  const duty = await getDutyByHsCodeCountry('180631','CAD')

  return NextResponse.json({ duty })
}
