import { ReactNode } from "react"
import { Header } from "./Header"

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-card p-8 rounded-xl border border-border shadow-sm">
          {children}
        </div>
      </main>
    </div>
  )
}

