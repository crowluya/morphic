import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  // Get the protocol from X-Forwarded-Proto header or request protocol
  const protocol =
    request.headers.get('x-forwarded-proto') || request.nextUrl.protocol

  // Get the host from X-Forwarded-Host header or request host
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || ''

  // Construct the base URL - ensure protocol has :// format
  const baseUrl = `${protocol}${protocol.endsWith(':') ? '//' : '://'}${host}`

  // Skip i18n for API routes and auth API
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next({ request })
    response.headers.set('x-url', request.url)
    response.headers.set('x-host', host)
    response.headers.set('x-protocol', protocol)
    response.headers.set('x-base-url', baseUrl)
    return response
  }

  // Apply i18n middleware for other routes
  const response = intlMiddleware(request)

  // Add request information to response headers
  response.headers.set('x-url', request.url)
  response.headers.set('x-host', host)
  response.headers.set('x-protocol', protocol)
  response.headers.set('x-base-url', baseUrl)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
