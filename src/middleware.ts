import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  publicRoutes,
  authRoutes,
  API_AUTH_PREFIX,
  LOGIN_ROUTE,
  DEFAULT_HOME_ROUTE,
} from '@/routes'

// async function getUserCredits(userId: string): Promise<{ credit: number }> {
//   try {
//     const credit = await getCreditBalanceByUserId({ userId: userId })
//     return credit || { credit: 0 }
//   } catch (error) {
//     console.error('Error fetching credit data:', error)
//     return { credit: 0 }
//   }
// }

export default auth(async (req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const pathname = nextUrl.pathname

  // Check if the route is an API authentication route
  const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX)

  // Check if the route is a public route
  const isPublicRoute = publicRoutes.includes(pathname)

  // Check if the route is an auth route (login, register, etc.)
  const isAuthRoute = authRoutes.includes(pathname)

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // If user is on auth route and logged in, redirect to dashboard
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_HOME_ROUTE, nextUrl))
    }
    return NextResponse.next()
  }

  // Allow public routes for everyone
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For protected routes, redirect to login if not authenticated
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname + nextUrl.search)
    return NextResponse.redirect(
      new URL(`${LOGIN_ROUTE}?callback=${callbackUrl}`, nextUrl)
    )
  }

  // Handle /no-credit route - redirect to home if user has credits
  //   if (pathname === '/no-credit' && isLoggedIn) {
  //     const creditData = await getUserCredits(req.auth?.user.id || '')
  //     if (creditData.credit > 0) {
  //       return NextResponse.redirect(new URL(DEFAULT_HOME_ROUTE, nextUrl))
  //     }
  //     return NextResponse.next()
  //   }

  //   // Check user credits for authenticated users accessing protected routes
  //   const creditData = await getUserCredits(req.auth?.user.id || '')
  //   if (creditData.credit <= 0) {
  //     return NextResponse.redirect(new URL('/no-credit', nextUrl))
  //   }

  // Add current path header for any components that need it
  const headers = new Headers(req.headers)
  headers.set('x-current-path', pathname)

  return NextResponse.next({
    request: {
      headers,
    },
  })
})

export const config = {
  runtime: 'nodejs',
  matcher: [
    // match all routes except static files and APIs
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|json)$).*)',
  ],
}
