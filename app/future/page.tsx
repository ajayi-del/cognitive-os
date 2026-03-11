'use client'

import { useState, useEffect } from 'react'
import { Target, TrendingUp, AlertTriangle, Brain, Zap, Users, Award, Compass, Plus, Edit, BarChart3, Clock } from 'lucide-react'

interface FutureSelfProfile {
  id: string
  userId: string
  title: string
  timeHorizon: '3months' | '6months' | '1year' | '5years'
  coreGoals: string[]
  activeDomains: string[]
  antiGoals: string[]
  identityTraits: string[]
  desiredSkills: string[]
  createdAt: Date
  updatedAt: Date
}

interface DriftSignal {
  id: string
  userId: string
  driftType: 'attention' | 'priority' | 'phase' | 'goal'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  dataEvidence?: any
  correctiveAction?: string
  detectedAt: Date
  resolved: boolean
}

interface AlignmentScore {
  category: string
  current: number
  target: number
  gap: number
  trend: 'improving' | 'stable' | 'declining'
}

export default function FutureSelfPage() {
  const [profile, setProfile] = useState<FutureSelfProfile | null>(null)
  const [driftSignals, setDriftSignals] = useState<DriftSignal[]>([])
  const [alignmentScores, setAlignmentScores] = useState<AlignmentScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editProfile, setEditProfile] = useState<Partial<FutureSelfProfile>>({})

  useEffect(() => {
    loadFutureSelfData()
  }, [])

  const loadFutureSelfData = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setProfile({
        id: '1',
        userId: 'user-1',
        title: 'Strategic Systems Builder',
        timeHorizon: '1year',
        coreGoals: [
          'Build world-class cognitive OS',
          'Master systems thinking',
          'Achieve financial independence through trading',
          'Create AI-powered productivity tools'
        ],
        activeDomains: [
          'cognitive-systems',
          'trading',
          'ai-development',
          'personal-productivity'
        ],
        antiGoals: [
          'Shiny object syndrome',
          'Perfectionism over progress',
          'Context switching without focus',
          'Building without user feedback'
        ],
        identityTraits: [
          'Strategic thinker',
          'Systems architect',
          'Continuous learner',
          'Execution-focused builder'
        ],
        desiredSkills: [
          'Advanced AI/ML engineering',
          'Quantitative trading',
          'Product design',
          'Technical leadership'
        ],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      })

      setDriftSignals([
        {
          id: '1',
          userId: 'user-1',
          driftType: 'attention',
          severity: 'medium',
          description: 'Attention shifting away from core trading goals',
          dataEvidence: { tradingTime: '15%', targetTime: '40%' },
          correctiveAction: 'Reallocate 2hrs daily to trading system development',
          detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          resolved: false
        },
        {
          id: '2',
          userId: 'user-1',
          driftType: 'priority',
          severity: 'low',
          description: 'Minor priority drift detected in cognitive OS development',
          dataEvidence: { featureCreep: true, coreFeatures: 'on_track' },
          correctiveAction: 'Review and refocus on MVP features',
          detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          resolved: false
        }
      ])

      setAlignmentScores([
        {
          category: 'Technical Skills',
          current: 0.75,
          target: 0.90,
          gap: 0.15,
          trend: 'improving'
        },
        {
          category: 'Trading Mastery',
          current: 0.60,
          target: 0.85,
          gap: 0.25,
          trend: 'stable'
        },
        {
          category: 'Systems Thinking',
          current: 0.85,
          target: 0.95,
          gap: 0.10,
          trend: 'improving'
        },
        {
          category: 'Productivity',
          current: 0.70,
          target: 0.90,
          gap: 0.20,
          trend: 'declining'
        },
        {
          category: 'Financial Independence',
          current: 0.45,
          target: 0.80,
          gap: 0.35,
          trend: 'improving'
        }
      ])

      setIsLoading(false)
    }, 1000)
  }

  const handleSaveProfile = () => {
    if (profile && editProfile) {
      setProfile({
        ...profile,
        ...editProfile,
        updatedAt: new Date()
      })
      setEditMode(false)
      setEditProfile({})
    }
  }

  const getSeverityColor = (severity: DriftSignal['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getTrendIcon = (trend: AlignmentScore['trend']) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      case 'stable': return <div className="w-4 h-4 bg-yellow-400 rounded-full" />
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getProgressColor = (current: number, target: number) => {
    const ratio = current / target
    if (ratio >= 0.9) return 'bg-green-500'
    if (ratio >= 0.7) return 'bg-yellow-500'
    if (ratio >= 0.5) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Target className="w-12 h-12 text-blue-400 animate-pulse" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">Loading Future Self Profile</div>
            <div className="text-blue-300">Analyzing goals and alignment...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Future Self</h1>
                <p className="text-blue-300 text-sm">Goal alignment and identity development</p>
              </div>
            </div>
            
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              {editMode ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Overview */}
        {profile && !editMode && (
          <div className="mb-8">
            <div className="bg-gradient-to-r p-1 rounded-3xl from-blue-500 to-purple-500">
              <div className="bg-slate-900 rounded-3xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{profile.title}</h2>
                    <div className="flex items-center space-x-4 text-blue-300">
                      <span className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{profile.timeHorizon}</span>
                      </span>
                      <span>Updated {new Date(profile.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Alignment Score</div>
                    <div className="text-3xl font-bold text-white">
                      {Math.round(alignmentScores.reduce((sum, score) => sum + (score.current / score.target) * 100, 0) / alignmentScores.length)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {editMode && profile && (
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Edit Future Self Profile</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Profile Title</label>
                  <input
                    type="text"
                    value={editProfile.title || profile.title}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Time Horizon</label>
                  <select
                    value={editProfile.timeHorizon || profile.timeHorizon}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, timeHorizon: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="5years">5 Years</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Core Goals</label>
                  <textarea
                    value={editProfile.coreGoals?.join('\n') || profile.coreGoals.join('\n')}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, coreGoals: e.target.value.split('\n').filter(g => g.trim()) }))}
                    placeholder="One goal per line..."
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 resize-none focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">Active Domains</label>
                    <textarea
                      value={editProfile.activeDomains?.join('\n') || profile.activeDomains.join('\n')}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, activeDomains: e.target.value.split('\n').filter(d => d.trim()) }))}
                      placeholder="One domain per line..."
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 resize-none focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">Anti-Goals</label>
                    <textarea
                      value={editProfile.antiGoals?.join('\n') || profile.antiGoals.join('\n')}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, antiGoals: e.target.value.split('\n').filter(g => g.trim()) }))}
                      placeholder="Things to avoid..."
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 resize-none focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">Identity Traits</label>
                    <textarea
                      value={editProfile.identityTraits?.join('\n') || profile.identityTraits.join('\n')}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, identityTraits: e.target.value.split('\n').filter(t => t.trim()) }))}
                      placeholder="Who you want to become..."
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 resize-none focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">Desired Skills</label>
                    <textarea
                      value={editProfile.desiredSkills?.join('\n') || profile.desiredSkills.join('\n')}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, desiredSkills: e.target.value.split('\n').filter(s => s.trim()) }))}
                      placeholder="Skills to develop..."
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 resize-none focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display Mode - Profile Details */}
        {profile && !editMode && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Core Identity */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-400" />
                Core Identity
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Identity Traits</h4>
                  <div className="space-y-2">
                    {profile.identityTraits.map((trait, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span className="text-gray-300">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Desired Skills</h4>
                  <div className="space-y-2">
                    {profile.desiredSkills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Goals & Domains */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Compass className="w-5 h-5 mr-2 text-green-400" />
                Goals & Domains
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Core Goals</h4>
                  <div className="space-y-3">
                    {profile.coreGoals.map((goal, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-400 text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-300">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Active Domains</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.activeDomains.map((domain, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3 text-red-400">Anti-Goals</h4>
                  <div className="space-y-2">
                    {profile.antiGoals.map((antiGoal, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                        <span className="text-gray-300">{antiGoal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alignment Scores */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-yellow-400" />
            Alignment Scores
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alignmentScores.map((score, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{score.category}</h4>
                  {getTrendIcon(score.trend)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Current</span>
                    <span className="text-white font-bold">{(score.current * 100).toFixed(0)}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Target</span>
                    <span className="text-gray-300">{(score.target * 100).toFixed(0)}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Gap</span>
                    <span className="text-orange-400 font-semibold">{(score.gap * 100).toFixed(0)}%</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${getProgressColor(score.current, score.target)}`}
                        style={{ width: `${(score.current / score.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drift Signals */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
            Drift Detection
          </h3>
          
          <div className="space-y-4">
            {driftSignals.map((signal, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      signal.driftType === 'attention' ? 'bg-blue-500/20' :
                      signal.driftType === 'priority' ? 'bg-purple-500/20' :
                      signal.driftType === 'phase' ? 'bg-green-500/20' :
                      'bg-orange-500/20'
                    }`}>
                      {signal.driftType === 'attention' && <Brain className="w-4 h-4 text-blue-400" />}
                      {signal.driftType === 'priority' && <Zap className="w-4 h-4 text-purple-400" />}
                      {signal.driftType === 'phase' && <Target className="w-4 h-4 text-green-400" />}
                      {signal.driftType === 'goal' && <Award className="w-4 h-4 text-orange-400" />}
                    </div>
                    <div>
                      <div className="text-white font-semibold capitalize">{signal.driftType} Drift</div>
                      <div className="text-gray-400 text-sm">
                        {new Date(signal.detectedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${getSeverityColor(signal.severity)}`}>
                      {signal.severity.toUpperCase()}
                    </span>
                    {!signal.resolved && (
                      <span className="px-2 py-1 bg-orange-400/20 text-orange-400 rounded-full text-xs">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3">{signal.description}</p>
                
                {signal.correctiveAction && (
                  <div className="bg-blue-400/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">Corrective Action</span>
                    </div>
                    <p className="text-gray-300 text-sm">{signal.correctiveAction}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
