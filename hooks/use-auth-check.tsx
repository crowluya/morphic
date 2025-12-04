'use client'

import type { User } from '@/lib/auth'
import { useSession } from '@/lib/auth/client'

export function useAuthCheck() {
  const { data: session, isPending } = useSession()

  return {
    user: session?.user as User | null,
    loading: isPending,
    isAuthenticated: !!session?.user
  }
}
