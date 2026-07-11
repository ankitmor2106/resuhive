"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { useQueryClient } from "@tanstack/react-query"
import * as authService from "@/services/auth"
import { Loader2 } from "lucide-react"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser)
  const queryClient = useQueryClient()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")
    const error = searchParams.get("error")

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`)
      return
    }

    if (!accessToken) {
      router.replace("/login?error=Google+sign-in+failed")
      return
    }

    // Store tokens
    window.localStorage.setItem("auth_token", accessToken)
    window.localStorage.removeItem("MOCK_LOGGED_OUT")

    if (refreshToken) {
      window.localStorage.setItem("refresh_token", refreshToken)
    }

    // Fetch current user and update stores
    authService.getCurrentUser().then((res) => {
      if (res.success) {
        setCurrentUser(res.data)
        queryClient.setQueryData(["currentUser"], res.data)
        router.replace("/dashboard")
      } else {
        router.replace("/login?error=Failed+to+load+user")
      }
    })
  }, [searchParams, router, setCurrentUser, queryClient])

  return (
    <div className="space-y-6 text-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-pine mx-auto" />
      <p className="text-sm text-muted-foreground">
        Completing Google sign-in...
      </p>
    </div>
  )
}
