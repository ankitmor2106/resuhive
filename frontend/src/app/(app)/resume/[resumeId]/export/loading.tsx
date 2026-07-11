import { Skeleton } from "@/components/ui/skeleton"

export default function ExportLoading() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  )
}
