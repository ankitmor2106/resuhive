import { AuthLayout } from "@/components/layout/AuthLayout"
import { AuthGuard } from "@/components/layout/AuthGuard"
import { ReactNode } from "react"

export default function RootAuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AuthLayout>{children}</AuthLayout>
    </AuthGuard>
  )
}
