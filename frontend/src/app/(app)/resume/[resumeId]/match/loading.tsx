import { Skeleton } from "@/components/ui/skeleton"

export default function MatchLoading() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-10 w-36" />
    </div>
  )
}
