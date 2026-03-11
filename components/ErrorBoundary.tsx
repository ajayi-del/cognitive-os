'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Cognitive OS Error:', error, errorInfo)
    
    // In production, you could log to an error tracking service
    // Sentry.captureException(error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <div className="error-content">
            <h2>System Recovery Mode</h2>
            <p>The Cognitive OS encountered an error but your data is safe.</p>
            <button 
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="recovery-button"
            >
              Restart System
            </button>
            <details className="error-details">
              <summary>Technical Details</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
