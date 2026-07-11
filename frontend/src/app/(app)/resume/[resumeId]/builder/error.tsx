"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function BuilderError({
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <AlertCircle className="h-10 w-10 text-brick" />
      <h2 className="text-xl font-semibold">Couldn't load the resume editor</h2>
      <p className="text-sm text-muted-foreground max-w-sm text-center">{error.message}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}
