import { NextResponse } from 'next/server'

// Better Auth handles OAuth callbacks via /api/auth/callback/:provider
// This route is kept for backwards compatibility and redirects to home
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/`)
}
