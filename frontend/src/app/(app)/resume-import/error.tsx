"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ResumeImportError({
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex flex-col items-center gap-4 py-12">
        <AlertCircle className="h-8 w-8 text-brick" />
        <h2 className="text-lg font-semibold">Import failed</h2>
        <p className="text-sm text-muted-foreground text-center">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
