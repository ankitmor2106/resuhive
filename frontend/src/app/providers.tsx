'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </NextThemesProvider>
    </QueryClientProvider>
  )
}
