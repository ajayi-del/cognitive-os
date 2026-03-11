'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Brain, Zap, AlertTriangle, TrendingUp, Code, RefreshCw, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react'

interface Complaint {
  id: string
  type: 'ui' | 'ux' | 'feature' | 'performance' | 'design' | 'logic'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  userImpact: string
  suggestedSolution: string
  timestamp: Date
  status: 'pending' | 'analyzing' | 'implementing' | 'completed' | 'failed'
  evolutionPhase?: number
  mutations?: string[]
}

interface EvolutionPhase {
  id: number
  name: string
  description: string
  status: 'locked' | 'active' | 'completed'
  requirements: string[]
  mutations: string[]
  progress: number
}

interface AppMutation {
  id: string
  type: 'component' | 'style' | 'logic' | 'feature' | 'architecture'
  target: string
  change: string
  reason: string
  priority: number
  status: 'pending' | 'applying' | 'applied' | 'failed'
  rollbackAvailable?: boolean
}

export default function EvolutionEngine() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [evolutionPhases, setEvolutionPhases] = useState<EvolutionPhase[]>([])
  const [currentPhase, setCurrentPhase] = useState(1)
  const [mutations, setMutations] = useState<AppMutation[]>([])
  const [isEvolving, setIsEvolving] = useState(false)
  const [evolutionLog, setEvolutionLog] = useState<string[]>([])

  // Initialize evolution phases
  useEffect(() => {
    const phases: EvolutionPhase[] = [
      {
        id: 1,
        name: 'Pattern Recognition',
        description: 'Learn user interaction patterns and preferences',
        status: 'active',
        requirements: ['5+ user interactions', 'Pattern analysis enabled'],
        mutations: ['adaptive-ui', 'smart-positioning', 'contextual-buttons'],
        progress: 0
      },
      {
        id: 2,
        name: 'UI Optimization',
        description: 'Evolve interface based on usage patterns',
        status: 'locked',
        requirements: ['Phase 1 complete', '10+ complaints analyzed'],
        mutations: ['dynamic-layout', 'smart-colors', 'responsive-behavior'],
        progress: 0
      },
      {
        id: 3,
        name: 'Feature Evolution',
        description: 'Generate new features based on user needs',
        status: 'locked',
        requirements: ['Phase 2 complete', '20+ insights generated'],
        mutations: ['auto-features', 'predictive-ui', 'smart-automation'],
        progress: 0
      },
      {
        id: 4,
        name: 'Architecture Mutation',
        description: 'Restructure app architecture for optimal performance',
        status: 'locked',
        requirements: ['Phase 3 complete', 'Critical issues resolved'],
        mutations: ['micro-services', 'lazy-loading', 'smart-caching'],
        progress: 0
      },
      {
        id: 5,
        name: 'Autonomous Intelligence',
        description: 'Self-improving AI with independent evolution',
        status: 'locked',
        requirements: ['All phases complete', '100+ successful mutations'],
        mutations: ['self-learning', 'auto-evolution', 'conscious-adaptation'],
        progress: 0
      }
    ]
    setEvolutionPhases(phases)
  }, [])

  // Auto-analyze complaints and generate mutations
  useEffect(() => {
    const pendingComplaints = complaints.filter(c => c.status === 'pending')
    if (pendingComplaints.length >= 3) {
      analyzeComplaintsAndEvolve()
    }
  }, [complaints])

  const analyzeComplaintsAndEvolve = useCallback(async () => {
    setIsEvolving(true)
    addEvolutionLog('🧠 Starting complaint analysis and evolution process...')

    // Phase 1: Pattern Recognition
    const patterns = identifyPatterns(complaints)
    addEvolutionLog(`📊 Identified ${patterns.length} usage patterns`)

    // Phase 2: Generate Mutations
    const generatedMutations = generateMutations(patterns)
    addEvolutionLog(`🔬 Generated ${generatedMutations.length} potential mutations`)

    // Phase 3: Prioritize and Apply
    const prioritizedMutations = prioritizeMutations(generatedMutations)
    addEvolutionLog(`⚡ Prioritized ${prioritizedMutations.length} mutations for implementation`)

    // Phase 4: Apply Evolution
    for (const mutation of prioritizedMutations.slice(0, 3)) {
      await applyMutation(mutation)
    }

    setIsEvolving(false)
    updatePhaseProgress()
  }, [complaints])

  const identifyPatterns = (complaints: Complaint[]) => {
    const patterns = []
    
    // UI Pattern Analysis
    const uiComplaints = complaints.filter(c => c.type === 'ui')
    if (uiComplaints.length >= 2) {
      patterns.push({
        type: 'ui-friction',
        description: 'Multiple UI issues detected',
        severity: 'high',
        mutations: ['simplify-interface', 'reduce-clicks', 'smart-grouping']
      })
    }

    // UX Pattern Analysis  
    const uxComplaints = complaints.filter(c => c.type === 'ux')
    if (uxComplaints.length >= 2) {
      patterns.push({
        type: 'ux-flow',
        description: 'User experience flow issues',
        severity: 'medium',
        mutations: ['streamline-workflow', 'reduce-friction', 'smart-shortcuts']
      })
    }

    // Feature Gap Analysis
    const featureComplaints = complaints.filter(c => c.type === 'feature')
    if (featureComplaints.length >= 3) {
      patterns.push({
        type: 'feature-gaps',
        description: 'Missing or inadequate features',
        severity: 'high',
        mutations: ['add-quick-actions', 'smart-suggestions', 'auto-complete']
      })
    }

    return patterns
  }

  const generateMutations = (patterns: any[]) => {
    const mutations: AppMutation[] = []

    patterns.forEach((pattern, index) => {
      pattern.mutations.forEach((mutation: string, mutationIndex: number) => {
        mutations.push({
          id: `mutation-${Date.now()}-${index}-${mutationIndex}`,
          type: inferMutationType(mutation),
          target: inferTarget(mutation, pattern),
          change: mutation,
          reason: `Address ${pattern.type}: ${pattern.description}`,
          priority: pattern.severity === 'critical' ? 1 : pattern.severity === 'high' ? 2 : 3,
          status: 'pending'
        })
      })
    })

    return mutations
  }

  const inferMutationType = (mutation: string): AppMutation['type'] => {
    if (mutation.includes('ui') || mutation.includes('interface') || mutation.includes('layout')) return 'component'
    if (mutation.includes('style') || mutation.includes('color') || mutation.includes('design')) return 'style'
    if (mutation.includes('flow') || mutation.includes('workflow') || mutation.includes('process')) return 'logic'
    if (mutation.includes('feature') || mutation.includes('add') || mutation.includes('new')) return 'feature'
    return 'architecture'
  }

  const inferTarget = (mutation: string, pattern: any): string => {
    if (pattern.type === 'ui-friction') return 'user-interface'
    if (pattern.type === 'ux-flow') return 'user-experience'
    if (pattern.type === 'feature-gaps') return 'feature-set'
    return 'app-architecture'
  }

  const prioritizeMutations = (mutations: AppMutation[]) => {
    return mutations.sort((a, b) => a.priority - b.priority)
  }

  const applyMutation = async (mutation: AppMutation) => {
    addEvolutionLog(`🔧 Applying mutation: ${mutation.change}`)
    
    // Update mutation status
    setMutations(prev => 
      prev.map(m => m.id === mutation.id ? { ...m, status: 'applying' } : m)
    )

    // Simulate mutation application
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Apply actual changes based on mutation type
    switch (mutation.type) {
      case 'component':
        applyComponentMutation(mutation)
        break
      case 'style':
        applyStyleMutation(mutation)
        break
      case 'logic':
        applyLogicMutation(mutation)
        break
      case 'feature':
        applyFeatureMutation(mutation)
        break
      case 'architecture':
        applyArchitectureMutation(mutation)
        break
    }

    // Mark as completed
    setMutations(prev => 
      prev.map(m => m.id === mutation.id ? { ...m, status: 'applied' } : m)
    )

    addEvolutionLog(`✅ Mutation applied: ${mutation.change}`)
  }

  const applyComponentMutation = (mutation: AppMutation) => {
    // Apply CSS changes dynamically
    const style = document.createElement('style')
    style.textContent = `
      .evolution-mutation-${mutation.id} {
        animation: evolution-pulse 2s ease-in-out;
        border: 2px solid hsl(var(--success) / 0.5);
      }
    `
    document.head.appendChild(style)

    // Add mutation class to relevant elements
    document.body.classList.add(`evolution-${mutation.id}`)
    addEvolutionLog(`🎨 Applied component mutation: ${mutation.change}`)
  }

  const applyStyleMutation = (mutation: AppMutation) => {
    const root = document.documentElement
    const currentColors = getComputedStyle(root).getPropertyValue('--primary')
    
    // Apply dynamic color changes
    if (mutation.change.includes('smart-colors')) {
      root.style.setProperty('--evolution-primary', '280 100% 70%')
      addEvolutionLog(`🎨 Applied style mutation: ${mutation.change}`)
    }
  }

  const applyLogicMutation = (mutation: AppMutation) => {
    // Store mutation in localStorage for persistence
    const mutations = JSON.parse(localStorage.getItem('app-mutations') || '[]')
    mutations.push(mutation)
    localStorage.setItem('app-mutations', JSON.stringify(mutations))
    addEvolutionLog(`⚙️ Applied logic mutation: ${mutation.change}`)
  }

  const applyFeatureMutation = (mutation: AppMutation) => {
    // Create new feature elements
    const featureElement = document.createElement('div')
    featureElement.className = `evolution-feature ${mutation.id}`
    featureElement.innerHTML = `
      <div class="fixed bottom-4 left-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg">
        <span class="text-sm">🚀 ${mutation.change}</span>
      </div>
    `
    document.body.appendChild(featureElement)
    addEvolutionLog(`✨ Applied feature mutation: ${mutation.change}`)
  }

  const applyArchitectureMutation = (mutation: AppMutation) => {
    // Simulate architecture changes
    addEvolutionLog(`🏗️ Applied architecture mutation: ${mutation.change}`)
    
    // Trigger app re-render with new architecture
    window.dispatchEvent(new CustomEvent('app-evolution', {
      detail: { mutation, type: 'architecture' }
    }))
  }

  const updatePhaseProgress = () => {
    setEvolutionPhases(prev => 
      prev.map(phase => {
        if (phase.id === currentPhase) {
          const newProgress = Math.min(100, phase.progress + 25)
          if (newProgress >= 100) {
            // Unlock next phase
            setCurrentPhase(currentPhase + 1)
            return { ...phase, progress: 100, status: 'completed' }
          }
          return { ...phase, progress: newProgress }
        }
        return phase
      })
    )
  }

  const addEvolutionLog = (message: string) => {
    setEvolutionLog(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const submitComplaint = (type: Complaint['type'], severity: Complaint['severity'], title: string, description: string) => {
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      type,
      severity,
      title,
      description,
      userImpact: 'User experience and workflow efficiency',
      suggestedSolution: 'AI will analyze and generate appropriate mutations',
      timestamp: new Date(),
      status: 'pending',
      evolutionPhase: currentPhase
    }

    setComplaints(prev => [newComplaint, ...prev])
    addEvolutionLog(`📝 New complaint registered: ${title}`)
  }

  const clearComplaints = () => {
    setComplaints([])
    localStorage.removeItem('evolution-complaints')
    addEvolutionLog('🗑️ Cleared all complaints')
  }

  const rollbackMutation = (mutationId: string) => {
    setMutations(prev => 
      prev.map(m => m.id === mutationId ? { ...m, status: 'failed', rollbackAvailable: true } : m)
    )
    addEvolutionLog(`↩️ Rolled back mutation: ${mutationId}`)
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-gray-900/95 backdrop-blur-lg 
                  border border-gray-700 rounded-xl p-4 shadow-2xl z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-white flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Evolution Engine
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isEvolving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
          }`} />
          <span className="text-xs text-gray-400">
            Phase {currentPhase}/5
          </span>
        </div>
      </div>

      {/* Evolution Phases */}
      <div className="mb-4">
        <h4 className="font-alternate ui-text mb-2">Evolution Phases</h4>
        <div className="space-y-2">
          {evolutionPhases.map(phase => (
            <div key={phase.id} 
                 className={`p-3 rounded-lg border transition-all ${
                   phase.status === 'completed' ? 'border-green-500 bg-green-500/10' :
                   phase.status === 'active' ? 'border-purple-500 bg-purple-500/10' :
                   'border-gray-600 bg-gray-600/10'
                 }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">
                    Phase {phase.id}: {phase.name}
                  </span>
                  {phase.status === 'active' && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  )}
                  {phase.status === 'completed' && (
                    <div className="text-green-400">✅</div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {phase.progress}%
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div className={`h-full rounded-full transition-all ${
                  phase.status === 'completed' ? 'bg-green-500' :
                  phase.status === 'active' ? 'bg-purple-500' :
                  'bg-gray-600'
                }`} style={{ width: `${phase.progress}%` }} />
              </div>
              <p className="text-xs text-gray-400">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Complaint Submit */}
      <div className="mb-4">
        <h4 className="font-alternate ui-text mb-2">Quick Complaint</h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => submitComplaint('ui', 'medium', 'UI is confusing', 'Too many clicks to find features')}
            className="p-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-xs hover:bg-red-500/30"
          >
            UI Issues
          </button>
          <button
            onClick={() => submitComplaint('ux', 'medium', 'Workflow is slow', 'Takes too many steps to complete tasks')}
            className="p-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-lg text-xs hover:bg-amber-500/30"
          >
            Workflow Issues
          </button>
          <button
            onClick={() => submitComplaint('feature', 'high', 'Missing features', 'Need better organization tools')}
            className="p-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg text-xs hover:bg-blue-500/30"
          >
            Feature Gaps
          </button>
          <button
            onClick={() => submitComplaint('performance', 'critical', 'App is slow', 'Lagging and unresponsive')}
            className="p-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30"
          >
            Performance
          </button>
        </div>
      </div>

      {/* Custom Complaint Input */}
      <div className="mb-4">
        <textarea
          placeholder="Describe what's bothering you about the app... Be specific!"
          className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg p-3 
                   text-gray-300 placeholder-gray-500 resize-none focus:outline-none 
                   focus:border-purple-500 text-sm"
          onChange={(e) => {
            if (e.target.value.length > 10) {
              submitComplaint('ui', 'medium', 'User Feedback', e.target.value)
            }
          }}
        />
      </div>

      {/* Active Mutations */}
      {mutations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-alternate ui-text mb-2">Active Mutations</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {mutations.slice(0, 5).map(mutation => (
              <div key={mutation.id} 
                   className={`p-2 rounded border text-xs ${
                     mutation.status === 'applied' ? 'border-green-500 bg-green-500/10 text-green-300' :
                     mutation.status === 'applying' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-300' :
                     mutation.status === 'failed' ? 'border-red-500 bg-red-500/10 text-red-300' :
                     'border-gray-600 bg-gray-600/10 text-gray-300'
                   }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{mutation.change}</span>
                  <div className="flex items-center space-x-1">
                    {mutation.status === 'applying' && (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    )}
                    {mutation.status === 'applied' && (
                      <div className="text-green-400">✅</div>
                    )}
                    {mutation.status === 'failed' && (
                      <button onClick={() => rollbackMutation(mutation.id)} 
                              className="text-red-400 hover:text-red-300">
                        ↩️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution Log */}
      {evolutionLog.length > 0 && (
        <div className="border-t border-gray-700 pt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-alternate ui-text">Evolution Log</h4>
            <button onClick={() => setEvolutionLog([])} 
                    className="text-xs text-gray-500 hover:text-gray-400">
              Clear
            </button>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {evolutionLog.map((log, index) => (
              <div key={index} className="text-xs text-gray-400 font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => {
            if (mutations.length > 0) {
              analyzeComplaintsAndEvolve()
            }
          }}
          disabled={isEvolving || mutations.length === 0}
          className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <div className="flex items-center justify-center space-x-2">
            {isEvolving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evolving...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Trigger Evolution</span>
              </>
            )}
          </div>
        </button>
        <button
          onClick={clearComplaints}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium 
                   hover:bg-gray-600 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
