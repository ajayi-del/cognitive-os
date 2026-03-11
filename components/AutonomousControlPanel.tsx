'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Calendar, 
  Briefcase, 
  Settings, 
  Zap, 
  Shield, 
  Activity,
  Bell,
  ToggleLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface AutonomousCapability {
  id: string
  name: string
  description: string
  status: 'idle' | 'active' | 'executing' | 'completed' | 'error'
  priority: number
  energy_cost: number
  last_execution?: Date
  success_rate: number
  autonomy_level: 'suggestion' | 'auto_execute' | 'full_autonomy'
}

interface SystemMetrics {
  total_actions: number
  successful_actions: number
  energy_level: number
  learning_score: number
  telegram_connected: boolean
  uptime: string
}

export function AutonomousControlPanel() {
  const [isAutonomous, setIsAutonomous] = useState(false)
  const [capabilities, setCapabilities] = useState<AutonomousCapability[]>([
    {
      id: 'proactive_career_assistant',
      name: 'Proactive Career Assistant',
      description: 'Automatically finds and applies to relevant jobs',
      status: 'idle',
      priority: 9,
      energy_cost: 50,
      success_rate: 0.85,
      autonomy_level: 'auto_execute'
    },
    {
      id: 'intelligent_communication_hub',
      name: 'Intelligent Communication Hub',
      description: 'Manages Telegram and other communications autonomously',
      status: 'idle',
      priority: 8,
      energy_cost: 30,
      success_rate: 0.78,
      autonomy_level: 'full_autonomy'
    },
    {
      id: 'predictive_scheduling',
      name: 'Predictive Life Scheduling',
      description: 'Anticipates needs and schedules proactively',
      status: 'idle',
      priority: 7,
      energy_cost: 20,
      success_rate: 0.82,
      autonomy_level: 'auto_execute'
    },
    {
      id: 'autonomous_learning_engine',
      name: 'Autonomous Learning Engine',
      description: 'Continuously learns and improves from interactions',
      status: 'active',
      priority: 6,
      energy_cost: 40,
      success_rate: 0.75,
      autonomy_level: 'full_autonomy'
    },
    {
      id: 'creative_content_generator',
      name: 'Creative Content Generator',
      description: 'Creates content and writes autonomously',
      status: 'idle',
      priority: 5,
      energy_cost: 45,
      success_rate: 0.70,
      autonomy_level: 'suggestion'
    }
  ])

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    total_actions: 127,
    successful_actions: 109,
    energy_level: 75,
    learning_score: 85,
    telegram_connected: true,
    uptime: '2d 14h 32m'
  })

  const [permissions, setPermissions] = useState({
    auto_job_apply: true,
    auto_communication: true,
    auto_scheduling: true,
    auto_financial_decisions: false,
    max_autonomy_level: 7
  })

  const [logs, setLogs] = useState([
    { timestamp: new Date(), message: 'Autonomous agent initialized', type: 'info' },
    { timestamp: new Date(Date.now() - 60000), message: 'Processed 3 Telegram messages', type: 'success' },
    { timestamp: new Date(Date.now() - 120000), message: 'Applied to 2 positions at Google', type: 'success' },
    { timestamp: new Date(Date.now() - 180000), message: 'Learning model updated with new patterns', type: 'info' },
    { timestamp: new Date(Date.now() - 240000), message: 'Created weekly schedule', type: 'success' }
  ])

  // Toggle autonomous mode
  const toggleAutonomous = async () => {
    const newState = !isAutonomous
    setIsAutonomous(newState)
    
    try {
      const response = await fetch('/api/autonomous/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState })
      })

      if (response.ok) {
        addLog(`Autonomous mode ${newState ? 'enabled' : 'disabled'}`, 'info')
      }
    } catch (error) {
      console.error('Failed to toggle autonomous mode:', error)
      addLog('Failed to toggle autonomous mode', 'error')
    }
  }

  // Execute capability manually
  const executeCapability = async (capabilityId: string) => {
    setCapabilities(prev => prev.map(cap => 
      cap.id === capabilityId 
        ? { ...cap, status: 'executing' }
        : cap
    ))

    try {
      const response = await fetch('/api/autonomous/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capability: capabilityId,
          manual_trigger: true
        })
      })

      if (response.ok) {
        const result = await response.json()
        setCapabilities(prev => prev.map(cap => 
          cap.id === capabilityId 
            ? { ...cap, status: 'completed', last_execution: new Date() }
            : cap
        ))
        addLog(`Executed ${capabilityId}: ${result.message}`, 'success')
      } else {
        throw new Error('Execution failed')
      }
    } catch (error) {
      setCapabilities(prev => prev.map(cap => 
        cap.id === capabilityId 
          ? { ...cap, status: 'error' }
          : cap
      ))
      addLog(`Failed to execute ${capabilityId}`, 'error')
    }
  }

  // Update permissions
  const updatePermission = async (permission: string, value: boolean | number) => {
    setPermissions(prev => ({ ...prev, [permission]: value }))

    try {
      const response = await fetch('/api/autonomous/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [permission]: value })
      })

      if (response.ok) {
        addLog(`Updated ${permission} to ${value}`, 'info')
      }
    } catch (error) {
      console.error('Failed to update permission:', error)
    }
  }

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setLogs(prev => [{ timestamp: new Date(), message, type }, ...prev.slice(0, 49)])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'executing': return 'text-blue-400'
      case 'completed': return 'text-emerald-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />
      case 'executing': return <Brain className="w-4 h-4" />
      case 'completed': return <Zap className="w-4 h-4" />
      case 'error': return <Shield className="w-4 h-4" />
      default: return <Bot className="w-4 h-4" />
    }
  }

  const getAutonomyLevelColor = (level: string) => {
    switch (level) {
      case 'full_autonomy': return 'text-red-400'
      case 'auto_execute': return 'text-yellow-400'
      case 'suggestion': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="autonomous-panel">
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Autonomous Agent Control</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Status:</span>
            <span className={`text-sm font-medium ${isAutonomous ? 'text-green-400' : 'text-gray-400'}`}>
              {isAutonomous ? 'Active' : 'Idle'}
            </span>
          </div>
          
          <button
            onClick={toggleAutonomous}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isAutonomous 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isAutonomous ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutonomous ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capabilities Panel */}
        <div className="capabilities-section">
          <h3 className="section-title">Autonomous Capabilities</h3>
          
          <div className="space-y-3">
            {capabilities.map((capability) => (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="capability-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${getStatusColor(capability.status)}`}>
                        {getStatusIcon(capability.status)}
                      </div>
                      <h4 className="font-medium text-white">{capability.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${getAutonomyLevelColor(capability.autonomy_level)}`}>
                        {capability.autonomy_level.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{capability.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Priority: {capability.priority}</span>
                      <span>Energy: {capability.energy_cost}</span>
                      <span>Success: {Math.round(capability.success_rate * 100)}%</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => executeCapability(capability.id)}
                    disabled={capability.status === 'executing'}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Execute
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="metrics-section">
          <h3 className="section-title">System Metrics</h3>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Actions</span>
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.total_actions}</div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Success Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round((systemMetrics.successful_actions / systemMetrics.total_actions) * 100)}%
              </div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Learning Score</span>
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.learning_score}</div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">Telegram</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {systemMetrics.telegram_connected ? 'Connected' : 'Offline'}
              </div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Uptime</span>
              </div>
              <div className="text-lg font-bold text-white">{systemMetrics.uptime}</div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Energy Level</span>
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.energy_level}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Panel */}
      <div className="permissions-section">
        <h3 className="section-title">Autonomy Permissions</h3>
        
        <div className="permissions-grid">
          <div className="permission-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">Auto Job Applications</span>
              </div>
              <button
                onClick={() => updatePermission('auto_job_apply', !permissions.auto_job_apply)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  permissions.auto_job_apply ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  permissions.auto_job_apply ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
          
          <div className="permission-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white">Auto Communication</span>
              </div>
              <button
                onClick={() => updatePermission('auto_communication', !permissions.auto_communication)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  permissions.auto_communication ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  permissions.auto_communication ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
          
          <div className="permission-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">Auto Scheduling</span>
              </div>
              <button
                onClick={() => updatePermission('auto_scheduling', !permissions.auto_scheduling)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  permissions.auto_scheduling ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  permissions.auto_scheduling ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
          
          <div className="permission-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-red-400" />
                <span className="text-sm text-white">Max Autonomy Level</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={permissions.max_autonomy_level}
                  onChange={(e) => updatePermission('max_autonomy_level', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-white">{permissions.max_autonomy_level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="logs-section">
        <h3 className="section-title">Activity Log</h3>
        
        <div className="logs-container">
          {logs.map((log, index) => (
            <div key={index} className="log-item">
              <div className="flex items-center gap-2">
                <Bell className={`w-3 h-3 ${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`} />
                <span className="text-xs text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span className="text-sm text-white">{log.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
