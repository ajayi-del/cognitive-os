import './globals.css'
import type { Metadata } from 'next'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Cognitive OS - Personal AI Operating System',
  description: 'Transform scattered thoughts into structured action and strategic direction',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="cognitive-bg min-h-screen">
        <Providers>
          <div className="flex">
            {/* Navigation Sidebar */}
            <AppSidebar />
            
            {/* Main Content */}
            <div className="flex-1 min-h-screen">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
