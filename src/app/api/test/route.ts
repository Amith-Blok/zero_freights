import { NextRequest, NextResponse } from 'next/server'
import { randomIdGenerator } from '../form/helper/lib'

export async function GET(_: NextRequest) {

  const blok_quote_id=randomIdGenerator()

  return NextResponse.json({blok_quote_id})
}
