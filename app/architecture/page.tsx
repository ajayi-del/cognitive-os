'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Inbox, 
  PenSquare, 
  GitBranch, 
  Database, 
  Activity, 
  Compass, 
  Brain, 
  Zap, 
  LayoutDashboard, 
  History,
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

interface Module {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  inputs: string[]
  outputs: string[]
  purpose: string
  whyItMatters: string
  position: { x: number; y: number }
}

interface SystemState {
  currentPhase: string
  primaryGoal: string
  alignmentScore: number
  driftLevel: 'low' | 'moderate' | 'high'
  topAction: string
  strongestSignal: string
}

const modules: Module[] = [
  {
    id: 'capture',
    label: 'Capture',
    description: 'Receives raw life input into the system.',
    icon: <Inbox className="w-6 h-6" />,
    inputs: ['notes', 'chat', 'voice dumps', 'links', 'screenshots', 'files'],
    outputs: ['raw captures', 'unprocessed items'],
    purpose: 'Collect thoughts and information without friction.',
    whyItMatters: 'This is the entry point for all cognitive processing.',
    position: { x: 100, y: 50 }
  },
  {
    id: 'router',
    label: 'Inbox / Router',
    description: 'Classifies and routes incoming input into the correct destination.',
    icon: <GitBranch className="w-6 h-6" />,
    inputs: ['raw captures', 'unprocessed items'],
    outputs: ['classified items', 'routed content'],
    purpose: 'Organize chaos into structured destinations.',
    whyItMatters: 'Prevents cognitive overload by automatic organization.',
    position: { x: 100, y: 150 }
  },
  {
    id: 'memory',
    label: 'Memory',
    description: 'Stores raw captures, processed notes, projects, event logs, and history.',
    icon: <Database className="w-6 h-6" />,
    inputs: ['classified items', 'routed content', 'event logs'],
    outputs: ['stored context', 'historical data', 'retrievable content'],
    purpose: 'Preserve context and support retrieval.',
    whyItMatters: 'Memory enables pattern recognition and learning over time.',
    position: { x: 100, y: 250 }
  },
  {
    id: 'signals',
    label: 'Signals',
    description: 'Detects recurring ideas, clusters, momentum, and meaningful patterns.',
    icon: <Activity className="w-6 h-6" />,
    inputs: ['memory items', 'captures', 'event history'],
    outputs: ['signal strength', 'recurring topics', 'cluster trends'],
    purpose: 'Turn repeated ideas into meaningful patterns.',
    whyItMatters: 'Distinguishes noise from what actually matters.',
    position: { x: 100, y: 350 }
  },
  {
    id: 'drift',
    label: 'Drift',
    description: 'Compares intended goals vs recent behavior and attention.',
    icon: <Compass className="w-6 h-6" />,
    inputs: ['signals', 'goals', 'recent activity'],
    outputs: ['alignment score', 'drift level', 'focus mismatch'],
    purpose: 'Monitor alignment between intention and behavior.',
    whyItMatters: 'Prevents unconscious drift from core objectives.',
    position: { x: 100, y: 450 }
  },
  {
    id: 'ai',
    label: 'AI Reasoning',
    description: 'Explains what the system detects in natural language.',
    icon: <Brain className="w-6 h-6" />,
    inputs: ['signals', 'drift data', 'patterns'],
    outputs: ['explanations', 'insights', 'interpretations'],
    purpose: 'Translate system detection into human understanding.',
    whyItMatters: 'Makes complex patterns actionable and understandable.',
    position: { x: 100, y: 550 }
  },
  {
    id: 'actions',
    label: 'Action Engine',
    description: 'Converts insight into recommended next steps.',
    icon: <Zap className="w-6 h-6" />,
    inputs: ['ai insights', 'drift warnings', 'signal patterns'],
    outputs: ['recommended actions', 'workflow suggestions', 'goal reconnection'],
    purpose: 'Transform understanding into execution.',
    whyItMatters: 'Bridges the gap between insight and action.',
    position: { x: 100, y: 650 }
  },
  {
    id: 'ui',
    label: 'Dashboard / Chat / UI',
    description: 'Displays state, signals, actions, and AI explanations.',
    icon: <LayoutDashboard className="w-6 h-6" />,
    inputs: ['system state', 'actions', 'ai explanations', 'drift data'],
    outputs: ['user interface', 'control views', 'chat responses'],
    purpose: 'Present system state and enable user interaction.',
    whyItMatters: 'The human interface for the entire cognitive system.',
    position: { x: 100, y: 750 }
  },
  {
    id: 'feedback',
    label: 'Feedback + Event Log',
    description: 'Logs accepted, rejected, and completed actions and loops them back into memory.',
    icon: <History className="w-6 h-6" />,
    inputs: ['user actions', 'completed tasks', 'system events'],
    outputs: ['event logs', 'learning data', 'memory updates'],
    purpose: 'Track outcomes and support system learning.',
    whyItMatters: 'Creates the feedback loop for continuous improvement.',
    position: { x: 100, y: 850 }
  }
]

export default function Architecture() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [systemState, setSystemState] = useState<SystemState>({
    currentPhase: 'Execution',
    primaryGoal: 'Cognitive OS Development',
    alignmentScore: 78,
    driftLevel: 'moderate',
    topAction: 'Build Capture Inbox',
    strongestSignal: 'Architecture Patterns'
  })

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Exploration': return '#22C55E'
      case 'Direction': return '#4F46E5'
      case 'Execution': return '#F59E0B'
      case 'Integration': return '#8B5CF6'
      case 'Expansion': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getDriftColor = (level: string) => {
    switch (level) {
      case 'low': return '#22C55E'
      case 'moderate': return '#F59E0B'
      case 'high': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return '#22C55E'
    if (score >= 60) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0F1C' }}>
      {/* Page Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: '#1F2937' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#F3F4F6' }}>
          Architecture
        </h1>
        <p className="text-lg" style={{ color: '#9CA3AF' }}>
          How Cognitive OS turns raw input into signal, direction, and action
        </p>
      </div>

      {/* Live System State Strip */}
      <div className="px-8 py-4 border-b" style={{ borderColor: '#1F2937' }}>
        <div className="flex flex-wrap gap-4 items-center">
          <div 
            className="px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: '#111827', 
              borderColor: '#1F2937',
              borderLeft: `4px solid ${getPhaseColor(systemState.currentPhase)}`
            }}
          >
            <div className="text-xs" style={{ color: '#9CA3AF' }}>Current Phase</div>
            <div className="font-semibold" style={{ color: '#F3F4F6' }}>
              {systemState.currentPhase}
            </div>
          </div>
          
          <div 
            className="px-4 py-2 rounded-xl border"
            style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
          >
            <div className="text-xs" style={{ color: '#9CA3AF' }}>Primary Goal</div>
            <div className="font-semibold" style={{ color: '#F3F4F6' }}>
              {systemState.primaryGoal}
            </div>
          </div>
          
          <div 
            className="px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: '#111827', 
              borderColor: '#1F2937',
              borderLeft: `4px solid ${getAlignmentColor(systemState.alignmentScore)}`
            }}
          >
            <div className="text-xs" style={{ color: '#9CA3AF' }}>Alignment</div>
            <div className="font-semibold" style={{ color: getAlignmentColor(systemState.alignmentScore) }}>
              {systemState.alignmentScore}%
            </div>
          </div>
          
          <div 
            className="px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: '#111827', 
              borderColor: '#1F2937',
              borderLeft: `4px solid ${getDriftColor(systemState.driftLevel)}`
            }}
          >
            <div className="text-xs" style={{ color: '#9CA3AF' }}>Drift Level</div>
            <div className="font-semibold" style={{ color: getDriftColor(systemState.driftLevel) }}>
              {systemState.driftLevel}
            </div>
          </div>
          
          <div 
            className="px-4 py-2 rounded-xl border"
            style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
          >
            <div className="text-xs" style={{ color: '#9CA3AF' }}>Top Action</div>
            <div className="font-semibold" style={{ color: '#4F46E5' }}>
              {systemState.topAction}
            </div>
          </div>
          
          <div 
            className="px-4 py-2 rounded-xl border"
            style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
          >
            <div className="text-xs" style={{ color: '#9CA3AF' }}>Strongest Signal</div>
            <div className="font-semibold" style={{ color: '#F59E0B' }}>
              {systemState.strongestSignal}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Architecture Diagram */}
        <div className="flex-1 p-8">
          <div className="relative" style={{ minHeight: '1000px' }}>
            {/* Connection Lines */}
            <svg className="absolute inset-0" style={{ zIndex: 1 }}>
              {modules.slice(0, -1).map((module, index) => {
                const nextModule = modules[index + 1]
                return (
                  <g key={module.id}>
                    <line
                      x1={module.position.x + 100}
                      y1={module.position.y + 40}
                      x2={nextModule.position.x + 100}
                      y2={nextModule.position.y + 40}
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeOpacity="0.3"
                    />
                    <circle
                      cx={nextModule.position.x + 100}
                      cy={nextModule.position.y + 40}
                      r="4"
                      fill="#4F46E5"
                    />
                  </g>
                )
              })}
              
              {/* Feedback Loop */}
              <path
                d={`M ${modules[modules.length - 1].position.x + 200} ${modules[modules.length - 1].position.y + 40} 
                    Q ${modules[modules.length - 1].position.x + 300} ${modules[modules.length - 1].position.y + 40}
                    ${modules[modules.length - 1].position.x + 300} ${modules[2].position.y + 40}
                    L ${modules[2].position.x + 200} ${modules[2].position.y + 40}`}
                stroke="#22C55E"
                strokeWidth="2"
                strokeOpacity="0.3"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>

            {/* Module Cards */}
            {modules.map((module) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: modules.indexOf(module) * 0.1 }}
                className="absolute cursor-pointer"
                style={{ 
                  left: `${module.position.x}px`, 
                  top: `${module.position.y}px`,
                  zIndex: 2
                }}
                onClick={() => setSelectedModule(module)}
              >
                <div 
                  className="w-48 p-4 rounded-xl border shadow-lg transition-all duration-200"
                  style={{ 
                    backgroundColor: '#111827', 
                    borderColor: selectedModule?.id === module.id ? '#4F46E5' : '#1F2937',
                    borderWidth: selectedModule?.id === module.id ? '2px' : '1px'
                  }}
                >
                  <div className="flex items-center mb-2" style={{ color: '#4F46E5' }}>
                    {module.icon}
                    <h3 className="ml-2 font-semibold" style={{ color: '#F3F4F6' }}>
                      {module.label}
                    </h3>
                  </div>
                  <p className="text-sm mb-3" style={{ color: '#9CA3AF' }}>
                    {module.description}
                  </p>
                  <div className="flex items-center text-xs" style={{ color: '#6B7280' }}>
                    <span>Click to explore</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* System Loop Explanation */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl" style={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}>
              <span style={{ color: '#9CA3AF' }}>System Loop:</span>
              <div className="flex items-center space-x-2">
                <span style={{ color: '#4F46E5' }}>Capture</span>
                <ArrowRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#4F46E5' }}>Understand</span>
                <ArrowRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#4F46E5' }}>Detect</span>
                <ArrowRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#4F46E5' }}>Explain</span>
                <ArrowRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#4F46E5' }}>Act</span>
                <ArrowRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#22C55E' }}>Learn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Detail Panel */}
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-96 border-l p-6"
            style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div style={{ color: '#4F46E5' }}>
                  {selectedModule.icon}
                </div>
                <h2 className="ml-3 text-xl font-bold" style={{ color: '#F3F4F6' }}>
                  {selectedModule.label}
                </h2>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Purpose
                </h3>
                <p style={{ color: '#F3F4F6' }}>
                  {selectedModule.purpose}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Description
                </h3>
                <p style={{ color: '#9CA3AF' }}>
                  {selectedModule.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Inputs
                </h3>
                <div className="space-y-1">
                  {selectedModule.inputs.map((input, index) => (
                    <div key={index} className="flex items-center" style={{ color: '#9CA3AF' }}>
                      <ArrowRight className="w-3 h-3 mr-2" style={{ color: '#4F46E5' }} />
                      {input}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Outputs
                </h3>
                <div className="space-y-1">
                  {selectedModule.outputs.map((output, index) => (
                    <div key={index} className="flex items-center" style={{ color: '#9CA3AF' }}>
                      <ArrowRight className="w-3 h-3 mr-2" style={{ color: '#22C55E' }} />
                      {output}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Why It Matters
                </h3>
                <p style={{ color: '#F59E0B' }}>
                  {selectedModule.whyItMatters}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
