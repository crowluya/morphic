import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

// Better Auth handles email confirmation via its own API
// This route is kept for backwards compatibility and redirects to home
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const next = searchParams.get('next') ?? '/'
  redirect(next)
}
