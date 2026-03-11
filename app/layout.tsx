import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from '@/components/navigation/nav-bar'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className + " cognitive-bg cognitive-text min-h-screen"}>
        <div className="flex">
          {/* Navigation Sidebar */}
          <div className="hidden lg:block w-64 min-h-screen p-4">
            <NavBar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <NavBar />
      </body>
    </html>
  )
}
