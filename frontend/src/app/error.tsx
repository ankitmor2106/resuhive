"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-paper p-4 text-center">
      <h2 className="mb-2 text-2xl font-bold text-ink">Something went wrong</h2>
      <p className="mb-6 text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
