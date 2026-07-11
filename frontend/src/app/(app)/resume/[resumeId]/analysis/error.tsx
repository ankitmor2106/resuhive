"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8">
      <AlertCircle className="h-8 w-8 text-brick" />
      <h2 className="text-lg font-semibold">ATS analysis unavailable</h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {error.message || "The analysis service is temporarily unavailable."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
