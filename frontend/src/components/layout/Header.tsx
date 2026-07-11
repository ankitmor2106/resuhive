"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Moon, Sun, User as UserIcon } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { useLogout } from "@/hooks/useAuth"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "./Logo"
import { SettingsSheet } from "./SettingsSheet"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, isAuthenticated } = useAuthStore()
  const logout = useLogout()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure theme is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left: Brand Logo */}
        <Link href="/" className="group transition-transform duration-200 hover:scale-[1.02]">
          <Logo showText iconClassName="h-11" />
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button (Temporarily Disabled)
          <Button
            variant="outline"
            size="icon"
            onClick={handleThemeToggle}
            className="h-9 w-9 rounded-md border border-border bg-transparent text-foreground hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          */}

          {isAuthenticated ? (
            // Authenticated Header Section
            <div className="flex items-center gap-3">

              {/* User settings / profile highlight via SettingsSheet */}
              <SettingsSheet>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
                    <UserIcon className="h-3 w-3" />
                  </div>
                  <span>{currentUser?.fullName || "Profile"}</span>
                </button>
              </SettingsSheet>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Unauthenticated Header Section
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === "/login" ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                Log in
              </Link>
              <Link href="/register">
                <Button
                  className="h-9 rounded-md bg-pine px-4 text-sm font-medium text-white hover:bg-pine/90 dark:bg-pine dark:text-white dark:hover:bg-pine/90"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
