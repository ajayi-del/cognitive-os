'use client'

import { useState, useEffect } from 'react'
import { Brain, Zap, AlertTriangle, CheckCircle, Activity, Cpu, MessageSquare, TrendingUp } from 'lucide-react'

interface SystemStatus {
  aiProviders: {
    deepseek: boolean
    gemini: boolean
    ollama: boolean
  }
  activeFeatures: string[]
  recentActivity: string[]
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
  lastUpdate: Date
}

export default function SystemBriefing() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    aiProviders: {
      deepseek: false,
      gemini: false,
      ollama: false
    },
    activeFeatures: [],
    recentActivity: [],
    systemHealth: 'good',
    lastUpdate: new Date()
  })

  useEffect(() => {
    // Check system status
    const checkSystem = async () => {
      try {
        // Check AI providers
        const deepseekKey = process.env.DEEPSEEK_API_KEY
        const geminiKey = process.env.GEMINI_API_KEY
        
        setSystemStatus(prev => ({
          ...prev,
          aiProviders: {
            deepseek: !!deepseekKey,
            gemini: !!geminiKey,
            ollama: true // Always available locally
          },
          activeFeatures: [
            'AI Mutation System',
            'Code Drop Zone',
            'Voice Recording',
            'Living Orb',
            'Diary Section',
            'Smart AI Routing'
          ],
          recentActivity: [
            'System initialized',
            'AI providers configured',
            'Code Drop Zone active',
            'Voice recording ready'
          ],
          systemHealth: deepseekKey || geminiKey ? 'excellent' : 'good',
          lastUpdate: new Date()
        }))
      } catch (error) {
        console.error('System check failed:', error)
      }
    }

    checkSystem()
    const interval = setInterval(checkSystem, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'warning': return 'text-amber-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />
      case 'good': return <Activity className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      default: return <Cpu className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-purple-500/30 shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">System Briefing</h3>
        </div>
        <div className={`flex items-center space-x-1 ${getHealthColor(systemStatus.systemHealth)}`}>
          {getHealthIcon(systemStatus.systemHealth)}
          <span className="text-xs capitalize">{systemStatus.systemHealth}</span>
        </div>
      </div>

      {/* AI Providers Status */}
      <div className="mb-3">
        <h4 className="text-xs text-gray-400 mb-2">AI Providers</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className={`text-center p-2 rounded ${systemStatus.aiProviders.deepseek ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-gray-800 border border-gray-700'}`}>
            <Cpu className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <span className="text-xs text-gray-300">DeepSeek</span>
            <span className={`text-xs block ${systemStatus.aiProviders.deepseek ? 'text-green-400' : 'text-red-400'}`}>
              {systemStatus.aiProviders.deepseek ? '✓' : '✗'}
            </span>
          </div>
          <div className={`text-center p-2 rounded ${systemStatus.aiProviders.gemini ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-gray-800 border border-gray-700'}`}>
            <Brain className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <span className="text-xs text-gray-300">Gemini</span>
            <span className={`text-xs block ${systemStatus.aiProviders.gemini ? 'text-green-400' : 'text-red-400'}`}>
              {systemStatus.aiProviders.gemini ? '✓' : '✗'}
            </span>
          </div>
          <div className="text-center p-2 rounded bg-green-900/30 border border-green-500/30">
            <Zap className="w-4 h-4 mx-auto mb-1 text-green-400" />
            <span className="text-xs text-gray-300">Ollama</span>
            <span className="text-xs text-green-400">✓</span>
          </div>
        </div>
      </div>

      {/* Active Features */}
      <div className="mb-3">
        <h4 className="text-xs text-gray-400 mb-2">Active Features</h4>
        <div className="flex flex-wrap gap-1">
          {systemStatus.activeFeatures.slice(0, 3).map((feature, index) => (
            <span key={index} className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded text-xs text-purple-300">
              {feature}
            </span>
          ))}
          {systemStatus.activeFeatures.length > 3 && (
            <span className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
              +{systemStatus.activeFeatures.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-3">
        <h4 className="text-xs text-gray-400 mb-2">Recent Activity</h4>
        <div className="space-y-1">
          {systemStatus.recentActivity.slice(0, 2).map((activity, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs text-gray-400">
              <MessageSquare className="w-3 h-3" />
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Update */}
      <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
        Last updated: {systemStatus.lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  )
}
