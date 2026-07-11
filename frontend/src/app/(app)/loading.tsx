import { Skeleton } from "@/components/ui/skeleton"

export default function AppLoading() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 border-r border-border flex-col p-4 gap-3">
        <Skeleton className="h-8 w-32 mb-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border px-6 flex items-center">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
