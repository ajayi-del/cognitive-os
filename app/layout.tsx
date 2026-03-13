'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Nexus Cognitive OS - Personal AI Operating System</title>
        <meta name="description" content="Nexus - Personal Cognitive AI Operating System for Systems Thinkers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="cognitive-bg min-h-screen">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
