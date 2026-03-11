// React Hook for BAZINGA AI Integration
// Provides AI capabilities to React components

import { useState, useCallback, useEffect } from 'react'

interface AIState {
  isLoading: boolean
  isAvailable: boolean
  error: string | null
}

interface UseAIOptions {
  onError?: (error: string) => void
}

export function useAI(options: UseAIOptions = {}) {
  const [state, setState] = useState<AIState>({
    isLoading: false,
    isAvailable: false,
    error: null
  })

  // Check AI service health on mount
  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/ai/status')
      const data = await response.json()
      setState(prev => ({
        ...prev,
        isAvailable: data.bazinga_available || data.status === 'healthy',
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAvailable: false,
        error: 'AI service unavailable'
      }))
    }
  }

  // Chat with AI
  const chat = useCallback(async (message: string, history: any[] = [], userState?: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, userState })
      })

      if (!response.ok) {
        throw new Error('Chat request failed')
      }

      const data = await response.json()
      setState(prev => ({ ...prev, isLoading: false }))
      return data
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chat failed'
      setState(prev => ({ ...prev, isLoading: false, error: errorMsg }))
      options.onError?.(errorMsg)
      
      // Return fallback response
      return {
        response: `I received: "${message}". AI service is temporarily unavailable.`,
        suggested_actions: [{ label: 'Retry', action: 'retry' }],
        fallback: true
      }
    }
  }, [options])

  // Analyze capture
  const analyzeCapture = useCallback(async (content: string, userContext?: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userContext })
      })

      if (!response.ok) {
        throw new Error('Analysis request failed')
      }

      const data = await response.json()
      setState(prev => ({ ...prev, isLoading: false }))
      return data
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Analysis failed'
      setState(prev => ({ ...prev, isLoading: false, error: errorMsg }))
      options.onError?.(errorMsg)
      
      // Return fallback analysis
      return {
        summary: content.slice(0, 100) + '...',
        sentiment: 'neutral',
        suggested_route: 'idea_bucket',
        keywords: [],
        confidence: 0.5,
        fallback: true
      }
    }
  }, [options])

  // Get routing suggestion
  const getRoutingSuggestion = useCallback(async (content: string, captureHistory: string[] = []) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/ai/routing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, captureHistory })
      })

      if (!response.ok) {
        throw new Error('Routing request failed')
      }

      const data = await response.json()
      setState(prev => ({ ...prev, isLoading: false }))
      return data
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Routing failed'
      setState(prev => ({ ...prev, isLoading: false, error: errorMsg }))
      options.onError?.(errorMsg)
      
      // Return fallback suggestion
      return {
        suggestion: 'idea_bucket',
        confidence: 0.6,
        fallback: true
      }
    }
  }, [options])

  // Generate tasks
  const generateTasks = useCallback(async (content: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/ai/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error('Tasks request failed')
      }

      const data = await response.json()
      setState(prev => ({ ...prev, isLoading: false }))
      return data
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Task generation failed'
      setState(prev => ({ ...prev, isLoading: false, error: errorMsg }))
      options.onError?.(errorMsg)
      
      // Return fallback tasks
      return {
        tasks: [
          {
            title: 'Process capture',
            description: content.slice(0, 100),
            priority: 'medium'
          }
        ],
        confidence: 0.5,
        fallback: true
      }
    }
  }, [options])

  // Analyze drift
  const analyzeDrift = useCallback(async (recentCaptures: string[], primaryGoal: string, alignmentScore: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/ai/drift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recentCaptures, primaryGoal, alignmentScore })
      })

      if (!response.ok) {
        throw new Error('Drift analysis request failed')
      }

      const data = await response.json()
      setState(prev => ({ ...prev, isLoading: false }))
      return data
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Drift analysis failed'
      setState(prev => ({ ...prev, isLoading: false, error: errorMsg }))
      options.onError?.(errorMsg)
      
      // Return fallback drift analysis
      const risk = alignmentScore > 70 ? 'low' : alignmentScore > 50 ? 'medium' : 'high'
      return {
        drift_risk: risk,
        reason: `Alignment score is ${alignmentScore}%`,
        suggestion: risk === 'high' ? 'Reconnect with your primary goal' : 'Continue monitoring',
        confidence: alignmentScore / 100,
        fallback: true
      }
    }
  }, [options])

  return {
    ...state,
    chat,
    analyzeCapture,
    getRoutingSuggestion,
    generateTasks,
    analyzeDrift,
    checkHealth
  }
}
