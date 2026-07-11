import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
