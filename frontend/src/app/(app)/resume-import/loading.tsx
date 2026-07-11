import { Skeleton } from "@/components/ui/skeleton"

export default function ResumeImportLoading() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg border-2 border-dashed" />
    </div>
  )
}
