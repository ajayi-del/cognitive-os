'use client'

import { useEffect, useState } from 'react'
import { Brain, FileText, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react'

export function MorningBriefing() {
  const [briefing, setBriefing] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const fetchBriefing = async () => {
    setIsGenerating(true)
    setError('')
    try {
      const response = await fetch('/api/morning-brief')
      if (!response.ok) throw new Error('Failed to fetch briefing')
      const text = await response.text()
      setBriefing(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsGenerating(false)
    }
  }

  // Auto-generate on mount if it's before 10am
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 10 && !briefing) {
      fetchBriefing()
    }
  }, [])

  const handleGenerate = async () => {
    await fetchBriefing()
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Morning Briefing</h3>
            <p className="text-sm text-gray-400">AI-generated daily intelligence</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg flex items-center space-x-2 transition-colors"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Brief me</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <h4 className="text-red-400 font-medium">Briefing Failed</h4>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-gray-400">Generating your morning briefing...</span>
          </div>
        </div>
      )}

      {briefing && !isGenerating && (
        <div className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {briefing}
            </div>
          </div>
        </div>
      )}

      {!briefing && !error && !isGenerating && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No briefing available yet</p>
          <p className="text-sm">Click "Brief me" to generate your morning briefing from your system state.</p>
        </div>
      )}
    </div>
  )
}
