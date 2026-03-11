import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
        {children}
      </body>
    </html>
  )
}
