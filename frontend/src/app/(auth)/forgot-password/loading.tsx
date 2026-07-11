import { Skeleton } from "@/components/ui/skeleton"

export default function ForgotPasswordLoading() {
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
