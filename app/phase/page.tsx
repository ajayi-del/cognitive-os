'use client'

import { useState, useEffect } from 'react'
import { Brain, Compass, Zap, Target, TrendingUp, AlertTriangle, Activity, BarChart3, Clock, ArrowRight } from 'lucide-react'
import { ClientDate } from '@/components/ui/ClientDate'

interface PhaseState {
  id: string
  userId: string
  currentPhase: 'exploration' | 'focus' | 'execution' | 'integration' | 'reflection'
  phaseConfidence: number
  phaseStartDate: Date
  dominantProjectIds: string[]
  allowedActions: string[]
  restrictedActions: string[]
  updatedAt: Date
}

interface PhaseSignal {
  type: 'activity' | 'attention' | 'momentum' | 'completion'
  strength: number
  description: string
  timestamp: Date
}

interface PhaseMetrics {
  phaseDuration: number
  activitiesCompleted: number
  attentionScore: number
  momentumScore: number
  phaseEfficiency: number
}

export default function PhaseDashboard() {
  const [phaseState, setPhaseState] = useState<PhaseState | null>(null)
  const [signals, setSignals] = useState<PhaseSignal[]>([])
  const [metrics, setMetrics] = useState<PhaseMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [manualOverride, setManualOverride] = useState(false)

  useEffect(() => {
    loadPhaseData()
  }, [])

  const loadPhaseData = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setPhaseState({
        id: '1',
        userId: 'user-1',
        currentPhase: 'focus',
        phaseConfidence: 0.87,
        phaseStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dominantProjectIds: ['1', '2'],
        allowedActions: ['deep_work', 'project_execution', 'skill_development'],
        restrictedActions: ['new_projects', 'major_pivots'],
        updatedAt: new Date()
      })

      setSignals([
        {
          type: 'activity',
          strength: 0.92,
          description: 'High focus activity detected on trading system project',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          type: 'attention',
          strength: 0.78,
          description: 'Attention patterns align with focus phase requirements',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          type: 'momentum',
          strength: 0.85,
          description: 'Strong momentum building in cognitive OS development',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
        },
        {
          type: 'completion',
          strength: 0.71,
          description: 'Moderate completion rate for current phase',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
        }
      ])

      setMetrics({
        phaseDuration: 5,
        activitiesCompleted: 23,
        attentionScore: 0.87,
        momentumScore: 0.92,
        phaseEfficiency: 0.85
      })

      setIsLoading(false)
    }, 1000)
  }

  const handlePhaseChange = (newPhase: PhaseState['currentPhase']) => {
    if (phaseState) {
      setPhaseState({
        ...phaseState,
        currentPhase: newPhase,
        phaseConfidence: 1.0,
        phaseStartDate: new Date(),
        updatedAt: new Date()
      })
    }
  }

  const getPhaseInfo = (phase: PhaseState['currentPhase']) => {
    switch (phase) {
      case 'exploration':
        return {
          name: 'Exploration',
          description: 'Broad idea generation and discovery',
          color: 'from-blue-500 to-cyan-500',
          icon: <Compass className="w-6 h-6" />,
          activities: ['Brainstorming', 'Research', 'Idea Capture'],
          goals: ['Generate diverse ideas', 'Explore new domains', 'Build knowledge base'],
          duration: '1-2 weeks'
        }
      case 'focus':
        return {
          name: 'Focus',
          description: 'Deep work on selected projects',
          color: 'from-purple-500 to-pink-500',
          icon: <Target className="w-6 h-6" />,
          activities: ['Deep Work', 'Project Execution', 'Skill Building'],
          goals: ['Complete key projects', 'Develop expertise', 'Ship meaningful work'],
          duration: '2-4 weeks'
        }
      case 'execution':
        return {
          name: 'Execution',
          description: 'Rapid implementation and shipping',
          color: 'from-green-500 to-emerald-500',
          icon: <Zap className="w-6 h-6" />,
          activities: ['Implementation', 'Testing', 'Deployment'],
          goals: ['Ship projects', 'Achieve outcomes', 'Generate momentum'],
          duration: '1-2 weeks'
        }
      case 'integration':
        return {
          name: 'Integration',
          description: 'Learning and synthesis',
          color: 'from-orange-500 to-red-500',
          icon: <Activity className="w-6 h-6" />,
          activities: ['Reflection', 'Synthesis', 'Planning'],
          goals: ['Integrate lessons', 'Plan next phase', 'Update systems'],
          duration: '3-5 days'
        }
      case 'reflection':
        return {
          name: 'Reflection',
          description: 'Review and strategic planning',
          color: 'from-indigo-500 to-purple-500',
          icon: <Brain className="w-6 h-6" />,
          activities: ['Review', 'Analysis', 'Strategic Planning'],
          goals: ['Review performance', 'Update strategy', 'Set new directions'],
          duration: '2-3 days'
        }
      default:
        return {
          name: 'Unknown',
          description: 'Phase not detected',
          color: 'from-gray-500 to-gray-600',
          icon: <AlertTriangle className="w-6 h-6" />,
          activities: [],
          goals: [],
          duration: 'Unknown'
        }
    }
  }

  const getSignalColor = (strength: number) => {
    if (strength >= 0.8) return 'text-green-400'
    if (strength >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProgressColor = (value: number) => {
    if (value >= 0.8) return 'bg-green-500'
    if (value >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const currentPhaseInfo = phaseState ? getPhaseInfo(phaseState.currentPhase) : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">Analyzing Cognitive Phase</div>
            <div className="text-purple-300">Detecting patterns and signals...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Phase Engine</h1>
                <p className="text-purple-300 text-sm">Cognitive state detection and management</p>
              </div>
            </div>
            
            <button
              onClick={() => setManualOverride(!manualOverride)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            >
              {manualOverride ? 'Lock Phase' : 'Manual Override'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Current Phase Display */}
        {currentPhaseInfo && phaseState && (
          <div className="mb-8">
            <div className="bg-gradient-to-r p-1 rounded-3xl" style={{ backgroundImage: `linear-gradient(to right, ${currentPhaseInfo.color})` }}>
              <div className="bg-slate-900 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 bg-gradient-to-br rounded-2xl ${currentPhaseInfo.color}`}>
                      {currentPhaseInfo.icon}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{currentPhaseInfo.name}</h2>
                      <p className="text-gray-300 text-lg">{currentPhaseInfo.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Phase Confidence</div>
                    <div className="text-3xl font-bold text-white">{(phaseState.phaseConfidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
                
                {/* Phase Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Phase Progress</span>
                    <span>Day {metrics?.phaseDuration || 0} of {currentPhaseInfo.duration}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getProgressColor(phaseState.phaseConfidence)}`}
                      style={{ width: `${phaseState.phaseConfidence * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Phase Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-400" />
                      Primary Goals
                    </h3>
                    <div className="space-y-3">
                      {currentPhaseInfo.goals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-gray-300">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-400" />
                      Key Activities
                    </h3>
                    <div className="space-y-3">
                      {currentPhaseInfo.activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-gray-300">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase Selection Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Compass className="w-6 h-6 mr-3 text-purple-400" />
            Phase Transitions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(['exploration', 'focus', 'execution', 'integration', 'reflection'] as const).map((phase) => {
              const phaseInfo = getPhaseInfo(phase)
              const isActive = phaseState?.currentPhase === phase
              
              return (
                <div
                  key={phase}
                  onClick={() => handlePhaseChange(phase)}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'scale-105' 
                      : 'hover:scale-102'
                  }`}
                >
                  <div className={`bg-gradient-to-br p-1 rounded-2xl ${phaseInfo.color}`}>
                    <div className={`bg-slate-900 rounded-2xl p-6 ${
                      isActive ? 'ring-4 ring-white/20' : ''
                    }`}>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 bg-gradient-to-br rounded-xl ${phaseInfo.color} ${
                          isActive ? 'animate-pulse' : ''
                        }`}>
                          {phaseInfo.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white mb-1">{phaseInfo.name}</h4>
                          <p className="text-gray-400 text-sm">{phaseInfo.duration}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{phaseInfo.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">
                          {isActive ? 'Current Phase' : 'Click to transition'}
                        </span>
                        {isActive && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-400 text-sm">Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Phase Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detection Signals */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-yellow-400" />
              Detection Signals
            </h3>
            
            <div className="space-y-4">
              {signals.map((signal, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        signal.type === 'activity' ? 'bg-blue-500/20' :
                        signal.type === 'attention' ? 'bg-purple-500/20' :
                        signal.type === 'momentum' ? 'bg-green-500/20' :
                        'bg-orange-500/20'
                      }`}>
                        {signal.type === 'activity' && <Activity className="w-4 h-4 text-blue-400" />}
                        {signal.type === 'attention' && <Brain className="w-4 h-4 text-purple-400" />}
                        {signal.type === 'momentum' && <TrendingUp className="w-4 h-4 text-green-400" />}
                        {signal.type === 'completion' && <Target className="w-4 h-4 text-orange-400" />}
                      </div>
                      <div>
                        <div className="text-white font-semibold capitalize">{signal.type}</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(signal.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-sm font-semibold ${getSignalColor(signal.strength)}`}>
                      {(signal.strength * 100).toFixed(0)}%
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm">{signal.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Metrics */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-green-400" />
              Phase Metrics
            </h3>
            
            {metrics && (
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Phase Duration</span>
                    <span className="text-white font-bold">{metrics.phaseDuration} days</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.min((metrics.phaseDuration / 14) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Activities Completed</span>
                    <span className="text-white font-bold">{metrics.activitiesCompleted}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min((metrics.activitiesCompleted / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Attention Score</span>
                    <span className="text-white font-bold">{(metrics.attentionScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${metrics.attentionScore * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Phase Efficiency</span>
                    <span className="text-white font-bold">{(metrics.phaseEfficiency * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${metrics.phaseEfficiency * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
