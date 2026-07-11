"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Header } from "./Header"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const isResumeBuilder = pathname.includes('/builder')
  const isMatch = pathname.includes('/match')
  const isAnalysis = pathname.includes('/analysis')
  const isExport = pathname.includes('/export')
  const resumeIdMatch = pathname.match(/\/resume\/([^\/]+)/)
  const resumeId = resumeIdMatch ? resumeIdMatch[1] : null

  const SubNav = () => {
    if (pathname === '/dashboard' || pathname === '/') return null

    return (
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-3 sm:px-4 md:px-6 h-12">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/dashboard')} 
            className="mr-2 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Go to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {resumeId && (
            <>
              <Link
                href={`/resume/${resumeId}/builder`}
                className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
                  isResumeBuilder
                    ? "border-pine text-pine font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Editor
              </Link>
          <Link
            href={`/resume/${resumeId}/analysis`}
            className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
              isAnalysis
                ? "border-pine text-pine font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            ATS Analysis
          </Link>
          <Link
            href={`/resume/${resumeId}/match`}
            className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
              isMatch
                ? "border-pine text-pine font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            JD Match
          </Link>
              <Link
                href={`/resume/${resumeId}/export`}
                className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
                  isExport
                    ? "border-pine text-pine font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Export
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <SubNav />
      <main className={`flex-1 ${isResumeBuilder ? "overflow-hidden h-[calc(100vh-7rem)]" : "overflow-auto"}`}>
        {children}
      </main>
    </div>
  )
}

