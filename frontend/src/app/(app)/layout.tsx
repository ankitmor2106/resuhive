import { AppLayout } from "@/components/layout/AppLayout"
import { AuthGuard } from "@/components/layout/AuthGuard"
import { ReactNode } from "react"

export default function RootAppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  )
}
