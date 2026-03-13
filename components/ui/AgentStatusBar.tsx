'use client'

import { useState, useEffect } from 'react'
import { Brain, Cpu, Zap, CheckCircle, AlertTriangle, Loader2, Terminal } from 'lucide-react'

interface AgentStatus {
  name: string
  status: 'online' | 'offline' | 'processing' | 'error'
  lastActivity?: Date
  responseTime?: number
  color: string
}

export default function AgentStatusBar() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      name: 'Claude',
      status: 'online',
      color: 'text-orange-400',
      lastActivity: new Date(),
      responseTime: 234
    },
    {
      name: 'DeepSeek',
      status: 'online',
      color: 'text-blue-400',
      lastActivity: new Date(),
      responseTime: 156
    },
    {
      name: 'Gemini',
      status: 'processing',
      color: 'text-amber-400',
      lastActivity: new Date(),
      responseTime: 445
    },
    {
      name: 'Ollama',
      status: 'online',
      color: 'text-green-400',
      lastActivity: new Date(),
      responseTime: 89
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time status updates
      setAgents(prev => prev.map(agent => {
        const random = Math.random()
        if (random > 0.95) {
          // Random status change
          const statuses: AgentStatus['status'][] = ['online', 'processing', 'offline']
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
          return { ...agent, status: newStatus, lastActivity: new Date() }
        }
        return agent
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-3 h-3" />
      case 'processing': return <Loader2 className="w-3 h-3 animate-spin" />
      case 'offline': return <AlertTriangle className="w-3 h-3" />
      case 'error': return <AlertTriangle className="w-3 h-3" />
      default: return <Cpu className="w-3 h-3" />
    }
  }

  const getStatusDot = (status: AgentStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'processing': return 'bg-amber-500 animate-pulse'
      case 'offline': return 'bg-red-500'
      case 'error': return 'bg-red-500 animate-pulse'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left Side - Agent Status */}
        <div className="flex items-center space-x-6">
          {agents.map((agent) => (
            <div key={agent.name} className="flex items-center space-x-2">
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(agent.status)}`} />
                {agent.status === 'processing' && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Brain className={`w-3 h-3 ${agent.color}`} />
                <span className="text-xs text-gray-300">{agent.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Center - System Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 text-purple-400" />
            <span className="text-xs text-gray-400">
              {agents.filter(a => a.status === 'online').length}/{agents.length} agents
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Avg: {Math.round(agents.reduce((sum, a) => sum + (a.responseTime || 0), 0) / agents.length)}ms
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => console.log('Opening command palette...')}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <Terminal className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">⌘K</span>
          </button>
          <div className="text-xs text-gray-500">
            Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}
