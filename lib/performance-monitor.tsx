// PRODUCTION PERFORMANCE MONITOR
// Real-time performance monitoring with Vercel Analytics

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Analytics } from '@vercel/analytics/react'
import * as Sentry from '@sentry/nextjs'

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  loadTime: number // Page load time
  memoryUsage: number // Memory usage in MB
  connectionType: string // Network connection type
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info'
  message: string
  metric: keyof PerformanceMetrics
  value: number
  threshold: number
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    loadTime: 0,
    memoryUsage: 0,
    connectionType: 'unknown'
  })
  
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)

  // Performance thresholds
  const thresholds = {
    fcp: { warning: 1800, error: 3000 }, // 1.8s warning, 3s error
    lcp: { warning: 2500, error: 4000 }, // 2.5s warning, 4s error
    fid: { warning: 100, error: 300 }, // 100ms warning, 300ms error
    cls: { warning: 0.1, error: 0.25 }, // 0.1 warning, 0.25 error
    ttfb: { warning: 800, error: 1800 }, // 800ms warning, 1.8s error
    loadTime: { warning: 3000, error: 5000 }, // 3s warning, 5s error
    memoryUsage: { warning: 100, error: 200 } // 100MB warning, 200MB error
  }

  const checkThresholds = useCallback((newMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = []

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = newMetrics[metric as keyof PerformanceMetrics]
      
      if (value > threshold.error) {
        newAlerts.push({
          type: 'error',
          message: `Critical: ${metric} is ${value}ms (threshold: ${threshold.error}ms)`,
          metric: metric as keyof PerformanceMetrics,
          value,
          threshold: threshold.error
        })
      } else if (value > threshold.warning) {
        newAlerts.push({
          type: 'warning',
          message: `Warning: ${metric} is ${value}ms (threshold: ${threshold.warning}ms)`,
          metric: metric as keyof PerformanceMetrics,
          value,
          threshold: threshold.warning
        })
      }
    })

    setAlerts(newAlerts)

    // Send alerts to Sentry
    newAlerts.forEach(alert => {
      if (alert.type === 'error') {
        Sentry.captureMessage(alert.message, {
          level: 'error',
          tags: {
            metric: alert.metric,
            value: alert.value.toString(),
            threshold: alert.threshold.toString()
          }
        })
      }
    })
  }, [thresholds])

  const measureWebVitals = useCallback(() => {
    if (!window.performance) return

    // Measure First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry
    const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : 0

    // Measure Largest Contentful Paint
    let lcp = 0
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      lcp = Math.round(lastEntry.startTime)
    })
    observer.observe({ entryTypes: ['largest-contentful-paint'] })

    // Measure First Input Delay
    let fid = 0
    if ('PerformanceEventTiming' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            fid = Math.round(entry.processingStart - entry.startTime)
          }
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    }

    // Measure Cumulative Layout Shift
    let cls = 0
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      })
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Measure Time to First Byte
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const ttfb = navigation ? Math.round(navigation.responseStart - navigation.requestStart) : 0

    // Measure total load time
    const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.navigationStart) : 0

    // Get connection info
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const connectionType = connection ? `${connection.effectiveType} (${connection.downlink}Mbps)` : 'unknown'

    // Get memory usage (if available)
    let memoryUsage = 0
    if ('memory' in performance) {
      const memory = (performance as any).memory
      memoryUsage = Math.round(memory.usedJSHeapSize / 1048576) // Convert to MB
    }

    const newMetrics: PerformanceMetrics = {
      fcp,
      lcp,
      fid,
      cls,
      ttfb,
      loadTime,
      memoryUsage,
      connectionType
    }

    setMetrics(newMetrics)
    checkThresholds(newMetrics)

    // Send to Vercel Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as any).gtag('event', 'web_vitals', {
        fcp,
        lcp,
        fid,
        cls,
        ttfb,
        loadTime,
        memoryUsage,
        connection_type: connectionType
      })
    }

    return newMetrics
  }, [checkThresholds])

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    
    // Initial measurement
    setTimeout(() => {
      measureWebVitals()
    }, 1000)

    // Continuous monitoring
    const interval = setInterval(() => {
      measureWebVitals()
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [measureWebVitals])

  useEffect(() => {
    if (!isMonitoring) {
      const cleanup = startMonitoring()
      return cleanup
    }
  }, [isMonitoring, startMonitoring])

  const forceMeasurement = useCallback(() => {
    measureWebVitals()
  }, [measureWebVitals])

  return {
    metrics,
    alerts,
    isMonitoring,
    forceMeasurement,
    startMonitoring: () => setIsMonitoring(true),
    stopMonitoring: () => setIsMonitoring(false)
  }
}

// Performance Dashboard Component
export function PerformanceDashboard() {
  const { metrics, alerts, isMonitoring, forceMeasurement } = usePerformanceMonitor()

  const getMetricColor = (metric: keyof PerformanceMetrics, value: number) => {
    const threshold = thresholds[metric]
    if (value > threshold.error) return '#ef4444'
    if (value > threshold.warning) return '#f59e0b'
    return '#10b981'
  }

  const formatMetric = (metric: keyof PerformanceMetrics, value: number) => {
    switch (metric) {
      case 'cls':
        return value.toFixed(3)
      case 'memoryUsage':
        return `${value}MB`
      case 'connectionType':
        return value
      default:
        return `${value}ms`
    }
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '14px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h3 style={{ margin: 0 }}>Performance Monitor</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isMonitoring ? '#10b981' : '#64748b',
          }} />
          <span style={{ fontSize: '12px' }}>
            {isMonitoring ? 'Monitoring' : 'Stopped'}
          </span>
          <button
            onClick={forceMeasurement}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
      }}>
        {Object.entries(metrics).map(([metric, value]) => (
          <div
            key={metric}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${getMetricColor(metric as keyof PerformanceMetrics, value)}40`,
            }}
          >
            <div style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '4px',
            }}>
              {metric.toUpperCase()}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: getMetricColor(metric as keyof PerformanceMetrics, value),
            }}>
              {formatMetric(metric as keyof PerformanceMetrics, value)}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{
          marginBottom: '20px',
        }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '14px' }}>Performance Alerts</h4>
          {alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                background: alert.type === 'error' 
                  ? 'rgba(239, 68, 68, 0.1)' 
                  : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${alert.type === 'error' ? '#ef4444' : '#f59e0b'}40`,
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '12px',
              }}
            >
              <span style={{
                color: alert.type === 'error' ? '#ef4444' : '#f59e0b',
                fontWeight: 'bold',
              }}>
                {alert.type.toUpperCase()}:
              </span>{' '}
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  )
}

// Performance optimization hook
export function usePerformanceOptimization() {
  const [isOptimized, setIsOptimized] = useState(false)

  const optimizeImages = useCallback(() => {
    // Optimize images with lazy loading
    const images = document.querySelectorAll('img:not([loading])')
    images.forEach(img => {
      img.setAttribute('loading', 'lazy')
    })
  }, [])

  const optimizeAnimations = useCallback(() => {
    // Reduce animations for low-end devices
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     (navigator as any).deviceMemory <= 2
    
    if (isLowEnd) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s')
      document.documentElement.style.setProperty('--transition-duration', '0.1s')
    }
  }, [])

  const optimizeFonts = useCallback(() => {
    // Preload critical fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = '/fonts/jetbrains-mono.woff2'
    fontLink.as = 'font'
    fontLink.type = 'font/woff2'
    fontLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontLink)
  }, [])

  const runOptimizations = useCallback(() => {
    optimizeImages()
    optimizeAnimations()
    optimizeFonts()
    setIsOptimized(true)
  }, [optimizeImages, optimizeAnimations, optimizeFonts])

  useEffect(() => {
    runOptimizations()
  }, [runOptimizations])

  return {
    isOptimized,
    runOptimizations
  }
}

// Performance thresholds for reference
const thresholds = {
  fcp: { warning: 1800, error: 3000 },
  lcp: { warning: 2500, error: 4000 },
  fid: { warning: 100, error: 300 },
  cls: { warning: 0.1, error: 0.25 },
  ttfb: { warning: 800, error: 1800 },
  loadTime: { warning: 3000, error: 5000 },
  memoryUsage: { warning: 100, error: 200 }
}
