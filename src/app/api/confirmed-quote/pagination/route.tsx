import { getPaginatedConfirmedQuotes } from '@/data/confirmed-quotes/confirmed-quotes'
import mongoosedb from '@/lib/mongoose-db'
import { getUser } from '@/lib/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await mongoosedb()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    //UserId
    const dbUser = await getUser()

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Execute query with pagination
    const { data, pagination } = await getPaginatedConfirmedQuotes({
      userId: dbUser.id,
      page: page,
      limit: limit,
      sortBy: sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    })

    return NextResponse.json({
      data,
      pagination,
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
