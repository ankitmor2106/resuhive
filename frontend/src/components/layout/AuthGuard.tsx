"use client"

import { useAuthStore } from "@/stores/authStore"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { useCurrentUser } from "@/hooks/useAuth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const { isLoading, isError } = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password') || pathname.startsWith('/auth/google/callback')
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.replace('/login')
    }
    
    if (!isLoading && isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.replace('/dashboard')
    }
  }, [isLoading, isAuthenticated, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-pine border-t-transparent animate-spin mb-4" />
          <p className="text-ink font-medium">Loading workspace...</p>
        </div>
      </div>
    )
  }

  // Prevent flash of protected content
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password') || pathname.startsWith('/auth/google/callback')
  if (!isAuthenticated && !isAuthPage) {
    return null
  }

  return <>{children}</>
}
