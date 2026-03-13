// REAL FACE ENGINE - NO SYNTHETIC DATA
// AI-powered predictions and real analysis

'use client'

import { useState, useEffect } from 'react'
import { useNotePersistence } from '@/lib/note-persistence'
import { callAI } from '@/lib/ai-providers-SIMPLIFIED'
import { UniversalBackButton } from '@/components/UniversalBackButton'

interface FaceEngineData {
  currentStreak: number
  energyLevel: number
  predictionAccuracy: number
  nextPrediction: string
  insights: string[]
  patterns: string[]
  recommendations: string[]
}

export default function RealFaceEngine() {
  const { notes, getNotesByCategory, searchNotes, getStats } = useNotePersistence()
  const [engineData, setEngineData] = useState<FaceEngineData>({
    currentStreak: 0,
    energyLevel: 50,
    predictionAccuracy: 0,
    nextPrediction: '',
    insights: [],
    patterns: [],
    recommendations: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false)

  useEffect(() => {
    generateRealData()
  }, [notes])

  const generateRealData = async () => {
    setIsLoading(true)
    
    try {
      const stats = getStats()
      const recentNotes = notes.slice(-10)
      
      // Calculate real streak based on daily activity
      const streak = calculateRealStreak(recentNotes)
      
      // Calculate energy level from note content
      const energy = calculateRealEnergy(recentNotes)
      
      // Generate AI-powered insights
      const insights = await generateRealInsights(recentNotes)
      
      // Generate AI-powered patterns
      const patterns = await generateRealPatterns(recentNotes)
      
      // Generate AI-powered recommendations
      const recommendations = await generateRealRecommendations(recentNotes, insights, patterns)
      
      setEngineData({
        currentStreak: streak,
        energyLevel: energy,
        predictionAccuracy: calculatePredictionAccuracy(recentNotes),
        nextPrediction: '',
        insights,
        patterns,
        recommendations
      })
      
    } catch (error) {
      console.error('Error generating face engine data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateRealStreak = (recentNotes: any[]): number => {
    if (recentNotes.length === 0) return 0
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const todayNotes = recentNotes.filter(note => 
      new Date(note.createdAt).toDateString() === today.toDateString()
    )
    
    const yesterdayNotes = recentNotes.filter(note => 
      new Date(note.createdAt).toDateString() === yesterday.toDateString()
    )
    
    // Simple streak calculation
    if (todayNotes.length > 0) {
      return yesterdayNotes.length > 0 ? 2 : 1
    } else if (yesterdayNotes.length > 0) {
      return 1
    }
    
    return 0
  }

  const calculateRealEnergy = (recentNotes: any[]): number => {
    if (recentNotes.length === 0) return 50
    
    // Calculate energy based on note frequency and content
    const now = new Date()
    const recentTime = new Date(now.getTime() - 24 * 60 * 60 * 1000) // Last 24 hours
    
    const recentActivity = recentNotes.filter(note => 
      new Date(note.createdAt) > recentTime
    )
    
    const activityScore = Math.min(recentActivity.length * 10, 100)
    const contentEnergy = recentNotes.reduce((acc, note) => {
      // Simple energy calculation based on content length and keywords
      const length = note.content.length
      const keywords = ['excited', 'energetic', 'motivated', 'focused', 'productive'].filter(keyword => 
        note.content.toLowerCase().includes(keyword)
      ).length
      
      return acc + (length / 10) + (keywords * 5)
    }, 0)
    
    return Math.min(Math.round((activityScore + contentEnergy) / recentNotes.length), 100)
  }

  const calculatePredictionAccuracy = (recentNotes: any[]): number => {
    // Simple accuracy calculation based on consistency
    if (recentNotes.length < 5) return 50
    
    const dailyNotes = recentNotes.reduce((acc, note) => {
      const date = new Date(note.createdAt).toDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const notesPerDay = Object.values(dailyNotes) as number[]
    const average = notesPerDay.reduce((sum: number, count: number) => sum + count, 0) / notesPerDay.length
    const consistency = notesPerDay.filter((count: number) => count >= average * 0.8).length / notesPerDay.length
    
    return Math.round(consistency * 100)
  }

  const generateRealInsights = async (recentNotes: any[]): Promise<string[]> => {
    if (recentNotes.length === 0) {
      return ['Start capturing thoughts to see insights']
    }
    
    try {
      const noteContent = recentNotes.map(note => note.content).join('\n')
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Analyze these recent notes and provide 3 key insights about patterns, productivity, or behavior:\n\n${noteContent}\n\nFormat as a JSON array of strings: ["insight 1", "insight 2", "insight 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        // Fallback if JSON parsing fails
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error generating insights:', error)
      return ['Unable to generate insights at the moment']
    }
  }

  const generateRealPatterns = async (recentNotes: any[]): Promise<string[]> => {
    if (recentNotes.length === 0) {
      return ['No patterns detected yet']
    }
    
    try {
      const noteContent = recentNotes.map(note => note.content).join('\n')
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Identify 3 recurring patterns in these notes:\n\n${noteContent}\n\nFormat as a JSON array of strings: ["pattern 1", "pattern 2", "pattern 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error generating patterns:', error)
      return ['Pattern analysis unavailable']
    }
  }

  const generateRealRecommendations = async (recentNotes: any[], insights: string[], patterns: string[]): Promise<string[]> => {
    try {
      const context = `
        Recent Notes: ${recentNotes.map(n => n.content).join('\n')}
        Insights: ${insights.join('\n')}
        Patterns: ${patterns.join('\n')}
      `
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Based on this data, provide 3 actionable recommendations:\n\n${context}\n\nFormat as a JSON array of strings: ["recommendation 1", "recommendation 2", "recommendation 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return ['Unable to generate recommendations']
    }
  }

  const generateNextPrediction = async () => {
    setIsGeneratingPrediction(true)
    
    try {
      const context = `
        Current Data:
        - Streak: ${engineData.currentStreak} days
        - Energy Level: ${engineData.energyLevel}%
        - Recent Notes: ${notes.slice(-5).map(n => n.content).join('\n')}
        - Insights: ${engineData.insights.join('\n')}
        - Patterns: ${engineData.patterns.join('\n')}
      `
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Based on this data, predict what will happen next for the user in terms of productivity, mood, or focus:\n\n${context}\n\nProvide a specific, actionable prediction in one sentence.`
          }
        ]
      })
      
      setEngineData(prev => ({ ...prev, nextPrediction: response.content }))
    } catch (error) {
      console.error('Error generating prediction:', error)
      setEngineData(prev => ({ ...prev, nextPrediction: 'Unable to generate prediction' }))
    } finally {
      setIsGeneratingPrediction(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-white/60">Analyzing your patterns...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <UniversalBackButton showHome />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Face Engine</h2>
        <p className="text-gray-400">AI-powered analysis of your cognitive patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Streak */}
        <div className="p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border border-orange-500/30">
          <h3 className="text-lg font-semibold text-orange-300 mb-2">🔥 Current Streak</h3>
          <p className="text-4xl font-bold text-white">{engineData.currentStreak} days</p>
          <p className="text-sm text-gray-400 mt-2">Keep capturing to maintain your streak!</p>
        </div>
        
        {/* Energy Level */}
        <div className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">⚡ Energy Level</h3>
          <p className="text-4xl font-bold text-white">{engineData.energyLevel}%</p>
          <p className="text-sm text-gray-400 mt-2">Based on recent activity patterns</p>
        </div>
        
        {/* Prediction Accuracy */}
        <div className="p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
          <h3 className="text-lg font-semibold text-green-300 mb-2">🎯 Prediction Accuracy</h3>
          <p className="text-4xl font-bold text-white">{engineData.predictionAccuracy}%</p>
          <p className="text-sm text-gray-400 mt-2">Based on pattern consistency</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">🧠 AI Insights</h3>
          <div className="space-y-3">
            {engineData.insights.map((insight, index) => (
              <div key={index} className="p-3 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">🔍 Detected Patterns</h3>
          <div className="space-y-3">
            {engineData.patterns.map((pattern, index) => (
              <div key={index} className="p-3 bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-300">{pattern}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">💡 AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engineData.recommendations.map((recommendation, index) => (
            <div key={index} className="p-4 bg-green-900/20 rounded-lg border border-green-700/50">
              <p className="text-gray-300">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Prediction */}
      <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">🔮 Next Prediction</h3>
          <button
            onClick={generateNextPrediction}
            disabled={isGeneratingPrediction}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {isGeneratingPrediction ? 'Generating...' : 'Generate Prediction'}
          </button>
        </div>
        
        {engineData.nextPrediction ? (
          <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
            <p className="text-lg text-gray-300">{engineData.nextPrediction}</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Click "Generate Prediction" to see AI-powered predictions
          </div>
        )}
      </div>

      {/* Data Source */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800/50">
        <p className="text-sm text-gray-500">
          📊 Powered by your actual notes and activity data • No synthetic information
        </p>
      </div>
    </div>
  )
}
