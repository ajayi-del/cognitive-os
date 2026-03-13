// REAL FUTURE SELF - NO SYNTHETIC DATA
// AI-powered future self analysis based on real data

'use client'

import { useState, useEffect } from 'react'
import { useNotePersistence } from '@/lib/note-persistence'
import { callAI } from '@/lib/ai-providers-SIMPLIFIED'
import { UniversalBackButton } from '@/components/UniversalBackButton'

interface FutureSelfData {
  futureGoals: string[]
  currentTrajectory: string
  trajectoryScore: number
  potentialPaths: string[]
  advice: string[]
  milestones: string[]
  riskFactors: string[]
}

export default function RealFutureSelf() {
  const { notes, getNotesByCategory, searchNotes, getStats } = useNotePersistence()
  const [futureData, setFutureData] = useState<FutureSelfData>({
    futureGoals: [],
    currentTrajectory: '',
    trajectoryScore: 50,
    potentialPaths: [],
    advice: [],
    milestones: [],
    riskFactors: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    generateRealFutureData()
  }, [notes])

  const generateRealFutureData = async () => {
    setIsLoading(true)
    
    try {
      const allNotes = notes
      const goalNotes = getNotesByCategory('task').concat(getNotesByCategory('idea'))
      const insightNotes = getNotesByCategory('memory')
      
      // Generate AI-powered future goals
      const goals = await generateFutureGoals(allNotes, goalNotes)
      
      // Analyze current trajectory
      const trajectory = await analyzeTrajectory(allNotes, goalNotes)
      
      // Calculate trajectory score
      const score = calculateTrajectoryScore(allNotes, goalNotes)
      
      // Generate potential paths
      const paths = await generatePotentialPaths(allNotes, goals)
      
      // Generate advice
      const advice = await generateFutureAdvice(allNotes, trajectory, goals)
      
      // Generate milestones
      const milestones = await generateMilestones(goals, trajectory)
      
      // Identify risk factors
      const risks = await identifyRiskFactors(allNotes, goalNotes)
      
      setFutureData({
        futureGoals: goals,
        currentTrajectory: trajectory,
        trajectoryScore: score,
        potentialPaths: paths,
        advice,
        milestones,
        riskFactors: risks
      })
      
    } catch (error) {
      console.error('Error generating future self data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateFutureGoals = async (allNotes: any[], goalNotes: any[]): Promise<string[]> => {
    if (allNotes.length === 0) {
      return ['Start capturing your thoughts to see future goals']
    }
    
    try {
      const context = `
        All Notes: ${allNotes.slice(-10).map(n => n.content).join('\n')}
        Goal/Project Notes: ${goalNotes.slice(-5).map(n => n.content).join('\n')}
      `
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Based on these notes, identify 3 potential future goals or aspirations:\n\n${context}\n\nFormat as a JSON array of strings: ["goal 1", "goal 2", "goal 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error generating goals:', error)
      return ['Unable to generate goals']
    }
  }

  const analyzeTrajectory = async (allNotes: any[], goalNotes: any[]): Promise<string> => {
    try {
      const context = `
        Recent Notes: ${allNotes.slice(-15).map(n => n.content).join('\n')}
        Goal Progress: ${goalNotes.slice(-5).map(n => n.content).join('\n')}
      `
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Analyze this data and describe the user's current life trajectory in one paragraph:\n\n${context}`
          }
        ]
      })
      
      return response.content
    } catch (error) {
      console.error('Error analyzing trajectory:', error)
      return 'Unable to analyze trajectory'
    }
  }

  const calculateTrajectoryScore = (allNotes: any[], goalNotes: any[]): number => {
    if (allNotes.length === 0) return 50
    
    // Calculate based on goal progress and consistency
    const goalProgress = goalNotes.length / (allNotes.length || 1)
    const consistency = calculateConsistency(allNotes)
    const positiveSentiment = calculatePositiveSentiment(allNotes)
    
    return Math.round((goalProgress * 40 + consistency * 30 + positiveSentiment * 30))
  }

  const calculateConsistency = (notes: any[]): number => {
    if (notes.length < 5) return 50
    
    const dailyNotes = notes.reduce((acc, note) => {
      const date = new Date(note.createdAt).toDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const notesPerDay = Object.values(dailyNotes) as number[]
    const average = notesPerDay.reduce((sum: number, count: number) => sum + count, 0) / notesPerDay.length
    const consistency = notesPerDay.filter((count: number) => count >= average * 0.8).length / notesPerDay.length
    
    return consistency * 100
  }

  const calculatePositiveSentiment = (notes: any[]): number => {
    if (notes.length === 0) return 50
    
    const positiveWords = ['happy', 'excited', 'motivated', 'productive', 'successful', 'achieved', 'completed', 'progress', 'growth', 'improved']
    const negativeWords = ['stressed', 'frustrated', 'failed', 'difficult', 'struggling', 'overwhelmed', 'tired', 'burnout']
    
    let positiveCount = 0
    let negativeCount = 0
    
    notes.forEach(note => {
      const content = note.content.toLowerCase()
      positiveWords.forEach(word => {
        if (content.includes(word)) positiveCount++
      })
      negativeWords.forEach(word => {
        if (content.includes(word)) negativeCount++
      })
    })
    
    const totalSentiment = positiveCount + negativeCount
    if (totalSentiment === 0) return 50
    
    return Math.round((positiveCount / totalSentiment) * 100)
  }

  const generatePotentialPaths = async (allNotes: any[], goals: string[]): Promise<string[]> => {
    try {
      const context = `
        Notes: ${allNotes.slice(-10).map(n => n.content).join('\n')}
        Goals: ${goals.join('\n')}
      `
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Based on this data, suggest 3 potential future paths or career directions:\n\n${context}\n\nFormat as a JSON array of strings: ["path 1", "path 2", "path 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error generating paths:', error)
      return ['Unable to generate paths']
    }
  }

  const generateFutureAdvice = async (allNotes: any[], trajectory: string, goals: string[]): Promise<string[]> => {
    try {
      const context = `
        Current Trajectory: ${trajectory}
        Goals: ${goals.join('\n')}
        Recent Notes: ${allNotes.slice(-8).map(n => n.content).join('\n')}
      `
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Provide 3 pieces of advice for achieving these goals based on current trajectory:\n\n${context}\n\nFormat as a JSON array of strings: ["advice 1", "advice 2", "advice 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error generating advice:', error)
      return ['Unable to generate advice']
    }
  }

  const generateMilestones = async (goals: string[], trajectory: string): Promise<string[]> => {
    try {
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Based on these goals and trajectory, suggest 3 key milestones to achieve:\n\nGoals: ${goals.join('\n')}\nTrajectory: ${trajectory}\n\nFormat as a JSON array of strings: ["milestone 1", "milestone 2", "milestone 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error generating milestones:', error)
      return ['Unable to generate milestones']
    }
  }

  const identifyRiskFactors = async (allNotes: any[], goalNotes: any[]): Promise<string[]> => {
    try {
      const context = `
        All Notes: ${allNotes.slice(-10).map(n => n.content).join('\n')}
        Goal Progress: ${goalNotes.slice(-5).map(n => n.content).join('\n')}
      `
      
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `Identify 3 potential risk factors or obstacles based on this data:\n\n${context}\n\nFormat as a JSON array of strings: ["risk 1", "risk 2", "risk 3"]`
          }
        ]
      })
      
      try {
        return JSON.parse(response.content)
      } catch {
        return response.content.split('\n').filter(line => line.trim()).slice(0, 3)
      }
    } catch (error) {
      console.error('Error identifying risks:', error)
      return ['Unable to identify risks']
    }
  }

  const reanalyzeTrajectory = async () => {
    setIsAnalyzing(true)
    await generateRealFutureData()
    setIsAnalyzing(false)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-white/60">Analyzing your future trajectory...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <UniversalBackButton showHome />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Future Self</h2>
        <p className="text-gray-400">AI-powered analysis of your future trajectory</p>
      </div>

      {/* Trajectory Score */}
      <div className="mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Current Trajectory Score</h3>
            <button
              onClick={reanalyzeTrajectory}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-white">{futureData.trajectoryScore}%</div>
            <div className="flex-1">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${futureData.trajectoryScore}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <p className="text-gray-300">{futureData.currentTrajectory}</p>
          </div>
        </div>
      </div>

      {/* Future Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">🎯 Future Goals</h3>
          <div className="space-y-3">
            {futureData.futureGoals.map((goal, index) => (
              <div key={index} className="p-3 bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-300">{goal}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">🛤️ Potential Paths</h3>
          <div className="space-y-3">
            {futureData.potentialPaths.map((path, index) => (
              <div key={index} className="p-3 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-300">{path}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">🏆 Key Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {futureData.milestones.map((milestone, index) => (
            <div key={index} className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">📍</span>
                <span className="text-sm text-gray-400">Milestone {index + 1}</span>
              </div>
              <p className="text-gray-300">{milestone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advice and Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">💡 Future Advice</h3>
          <div className="space-y-3">
            {futureData.advice.map((advice, index) => (
              <div key={index} className="p-3 bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-300">{advice}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">⚠️ Risk Factors</h3>
          <div className="space-y-3">
            {futureData.riskFactors.map((risk, index) => (
              <div key={index} className="p-3 bg-red-900/20 rounded-lg border-l-4 border-red-500">
                <p className="text-gray-300">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800/50">
        <p className="text-sm text-gray-500">
          📊 Powered by your actual notes and goals • No synthetic predictions
        </p>
      </div>
    </div>
  )
}
