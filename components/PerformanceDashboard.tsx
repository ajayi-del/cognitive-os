// ROI FIX #3: REAL-TIME PERFORMANCE MONITORING
// Add performance monitoring dashboard

'use client'

import { useState, useEffect } from 'react'
import { usePerformanceMonitor } from '@/lib/performance-monitor'
import { Analytics } from '@vercel/analytics/react'

export default function PerformanceDashboard() {
  const { metrics, alerts, isMonitoring, forceMeasurement } = usePerformanceMonitor()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show performance dashboard in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) {
    return <Analytics />
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      width: '320px',
      background: 'rgba(0, 0, 0, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      backdropFilter: 'blur(10px)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>Performance</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isMonitoring ? '#10b981' : '#64748b',
          }} />
          <button
            onClick={forceMeasurement}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '4px',
              padding: '2px 6px',
              color: '#fff',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#94a3b8' }}>FCP:</span>
          <span style={{ 
            color: metrics.fcp > 3000 ? '#ef4444' : metrics.fcp > 1800 ? '#f59e0b' : '#10b981',
            marginLeft: '8px'
          }}>
            {metrics.fcp}ms
          </span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#94a3b8' }}>LCP:</span>
          <span style={{ 
            color: metrics.lcp > 4000 ? '#ef4444' : metrics.lcp > 2500 ? '#f59e0b' : '#10b981',
            marginLeft: '8px'
          }}>
            {metrics.lcp}ms
          </span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#94a3b8' }}>Memory:</span>
          <span style={{ 
            color: metrics.memoryUsage > 200 ? '#ef4444' : metrics.memoryUsage > 100 ? '#f59e0b' : '#10b981',
            marginLeft: '8px'
          }}>
            {metrics.memoryUsage}MB
          </span>
        </div>
        <div>
          <span style={{ color: '#94a3b8' }}>Load:</span>
          <span style={{ 
            color: metrics.loadTime > 5000 ? '#ef4444' : metrics.loadTime > 3000 ? '#f59e0b' : '#10b981',
            marginLeft: '8px'
          }}>
            {metrics.loadTime}ms
          </span>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '6px',
          padding: '8px',
          marginBottom: '8px',
        }}>
          {alerts.slice(0, 2).map((alert, index) => (
            <div key={index} style={{ fontSize: '10px', marginBottom: '4px' }}>
              <span style={{ color: '#ef4444' }}>⚠️</span> {alert.message.substring(0, 50)}...
            </div>
          ))}
        </div>
      )}

      {/* Analytics */}
      <Analytics />
    </div>
  )
}
