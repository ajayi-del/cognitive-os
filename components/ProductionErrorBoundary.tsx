// PRODUCTION-GRADE ERROR BOUNDARY
// Handles all app errors gracefully with Sentry integration

'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorId: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; errorId: string; retry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ProductionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: 'error-boundary-' + Date.now().toString(36)
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })

    // Send to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: 'production',
        errorId: this.state.errorId,
      },
    })

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Auto-retry for certain errors
    if (this.shouldAutoRetry(error)) {
      this.scheduleRetry()
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private shouldAutoRetry(error: Error): boolean {
    // Auto-retry for network errors and temporary issues
    return (
      error.name === 'TypeError' ||
      error.name === 'NetworkError' ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed')
    )
  }

  private scheduleRetry = () => {
    this.retryTimeoutId = setTimeout(() => {
      this.retry()
    }, 5000) // Retry after 5 seconds
  }

  private retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  private handleManualRetry = () => {
    this.retry()
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            errorId={this.state.errorId}
            retry={this.handleManualRetry}
          />
        )
      }

      // Default production error UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '40px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}>
            {/* Error Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}>
              ⚠️
            </div>

            {/* Error Title */}
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 16px',
              color: '#fff',
            }}>
              Something went wrong
            </h1>

            {/* Error Message */}
            <p style={{
              fontSize: '16px',
              lineHeight: '1.5',
              margin: '0 0 24px',
              color: '#94a3b8',
            }}>
              We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <details style={{
                marginBottom: '24px',
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}>
                  Error Details
                </summary>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#fbbf24',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {this.state.error.name}: {this.state.error.message}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\n'}
                      Component Stack:
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Error ID */}
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '24px',
            }}>
              Error ID: {this.state.errorId}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={this.handleManualRetry}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                Reload Page
              </button>
            </div>

            {/* Support Info */}
            <div style={{
              marginTop: '32px',
              fontSize: '14px',
              color: '#64748b',
            }}>
              If this problem persists, please contact support with the error ID above.
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for using error boundary
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
    Sentry.captureException(error)
  }, [])

  return {
    error,
    setError: captureError,
    resetError
  }
}

// Specialized error boundary for async operations
export function AsyncErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ProductionErrorBoundary
      fallback={({ error, errorId, retry }) => (
        <div style={{
          padding: '20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: '#fff',
        }}>
          <h3 style={{ margin: '0 0 8px' }}>Async Operation Failed</h3>
          <p style={{ margin: '0 0 16px', fontSize: '14px' }}>
            {error.message}
          </p>
          <button
            onClick={retry}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '4px',
              padding: '8px 16px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ProductionErrorBoundary>
  )
}

// Global error boundary for the entire app
export default function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ProductionErrorBoundary
      onError={(error, errorInfo) => {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Global Error Boundary caught an error:', error)
          console.error('Error Info:', errorInfo)
        }
      }}
    >
      {children}
    </ProductionErrorBoundary>
  )
}
