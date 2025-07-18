import { NextRequest, NextResponse } from 'next/server'
import { generateOfferId } from '../form/helper/lib'

export async function GET(_: NextRequest) {
  const blok_quote_id = await generateOfferId()

  return NextResponse.json({ blok_quote_id })
}
