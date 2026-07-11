import { Skeleton } from "@/components/ui/skeleton"

export default function BuilderLoading() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Editor pane skeleton */}
      <div className="w-full lg:w-[45%] border-r border-border p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-20" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-36" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
      {/* Preview pane skeleton */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-mist p-8">
        <div className="w-full max-w-[600px] aspect-[8.5/11] bg-white rounded shadow-xl p-8 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <div className="pt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  )
}
