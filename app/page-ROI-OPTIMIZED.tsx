// ROI FIX #2: PERFORMANCE OPTIMIZATION
// Add lazy loading and performance optimizations to main page

'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'
import { usePerformanceOptimization } from '@/lib/performance-monitor'

// Lazy load heavy components
const NexusFeed = dynamic(() => import('@/components/NexusFeed'), {
  loading: () => <div>Loading Nexus...</div>,
  ssr: false
})

const RealFaceEngine = dynamic(() => import('@/components/RealFaceEngine'), {
  loading: () => <div>Loading Face Engine...</div>,
  ssr: false
})

const RealFutureSelf = dynamic(() => import('@/components/RealFutureSelf'), {
  loading: () => <div>Loading Future Self...</div>,
  ssr: false
})

// Performance optimization wrapper
function PerformanceWrapper({ children }: { children: React.ReactNode }) {
  const { isOptimized, runOptimizations } = usePerformanceOptimization()

  useEffect(() => {
    runOptimizations()
  }, [runOptimizations])

  return <>{children}</>
}

// Lazy loading component
function LazyLoader({ children, fallback }: { 
  children: React.ReactNode
  fallback: React.ReactNode 
}) {
  return (
    <Suspense fallback={fallback}>
      <PerformanceWrapper>
        {children}
      </PerformanceWrapper>
    </Suspense>
  )
}

export default function OptimizedHomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen cognitive-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading Cognitive OS...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Lazy load Nexus only when needed */}
      <LazyLoader fallback={<div className="fixed top-4 right-4 text-white">Loading Nexus...</div>}>
        <NexusFeed />
      </LazyLoader>

      {/* Lazy load chess only when user opens it */}
      {/* <LazyLoader fallback={<div>Loading Chess...</div>}>
        <InteractiveChess />
      </LazyLoader> */}

      {/* Lazy load Face Engine */}
      {/* <LazyLoader fallback={<div>Loading Face Engine...</div>}>
        <RealFaceEngine />
      </LazyLoader> */}

      {/* Lazy load Future Self */}
      {/* <LazyLoader fallback={<div>Loading Future Self...</div>}>
        <RealFutureSelf />
      </LazyLoader> */}
    </div>
  )
}
