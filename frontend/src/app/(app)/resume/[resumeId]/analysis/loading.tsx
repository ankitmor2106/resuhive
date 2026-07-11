import { Skeleton } from "@/components/ui/skeleton"

export default function AnalysisLoading() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Score header */}
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      {/* Weighted meter */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-full rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {/* Recommendations */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-44" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
