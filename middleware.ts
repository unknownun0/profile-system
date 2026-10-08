import { NextRequest, NextResponse } from 'next/server'

// Password-protects /admin with HTTP Basic Auth (any username, password = ADMIN_PASSWORD)
export function middleware(req: NextRequest) {
  const h = req.headers.get('authorization')
  if (h?.startsWith('Basic ')) {
    const decoded = atob(h.slice(6))
    if (decoded.slice(decoded.indexOf(':') + 1) === process.env.ADMIN_PASSWORD) return NextResponse.next()
  }
  return new NextResponse('Admin login required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  })
}
export const config = { matcher: ['/admin/:path*'] }
