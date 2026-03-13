'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Brain } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: error.message || 'Unknown error occurred'
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Cognitive OS Error:', error, errorInfo)
    
    // Log detailed error info
    console.error('Error Stack:', error.stack)
    console.error('Component Stack:', errorInfo.componentStack)
    
    // Store error in localStorage for debugging
    try {
      localStorage.setItem('cognitive-os-last-error', JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      }))
    } catch (e) {
      console.error('Failed to store error info:', e)
    }
  }

  handleReset = () => {
    console.log('🔄 Resetting error boundary...')
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    
    // Clear any stored error state
    try {
      localStorage.removeItem('cognitive-os-last-error')
    } catch (e) {
      console.error('Failed to clear error info:', e)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-xl border border-red-500/30 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-900/30 rounded-full border border-red-500/30">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              System Error Detected
            </h2>
            
            <p className="text-gray-400 mb-4">
              Something went wrong in the Cognitive OS. The system has been protected from crashing.
            </p>
            
            {this.state.errorInfo && (
              <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-500 font-mono">
                  {this.state.errorInfo}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recover System</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Full Reload
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Brain className="w-3 h-3" />
                <span>Cognitive OS - Error Recovery</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
