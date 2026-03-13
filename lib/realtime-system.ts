'use client'

// 🌐 Real-time System State WebSocket Implementation

import { useState, useEffect } from 'react'

export interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical'
  cpu: number
  memory: number
  disk: number
  network: number
  lastCheck: Date
}

export interface AIAgentStatus {
  name: string
  model: string
  status: 'online' | 'offline' | 'processing' | 'error'
  lastActivity: Date
  responseTime: number
  tokensUsed: number
  requestsPerMinute: number
}

export interface SystemMetrics {
  uptime: number
  requestsProcessed: number
  errorsLogged: number
  averageResponseTime: number
  activeConnections: number
  memoryUsage: number
  cpuUsage: number
}

export interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  timestamp: Date
  acknowledged: boolean
  resolved: boolean
}

class RealtimeSystemAPI {
  private ws: WebSocket | null = null
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor(private baseUrl: string = 'http://localhost:3000') {}

  // Initialize WebSocket connection
  async connect(): Promise<void> {
    try {
      // Close existing connection
      if (this.ws) {
        this.ws.close()
      }

      // Create new WebSocket connection
      const wsUrl = this.baseUrl.replace('http', 'ws') + '/api/system-state'
      console.log('🔌 Connecting to System State API:', wsUrl)
      
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('✅ System State API connected')
        this.reconnectAttempts = 0
        
        // Start heartbeat
        this.startHeartbeat()
        
        // Request initial state
        this.sendMessage({
          type: 'get-state',
          timestamp: new Date()
        })
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error)
        }
      }
      
      this.ws.onclose = (event) => {
        console.log('🔌 System State API disconnected:', event.code, event.reason)
        this.stopHeartbeat()
        this.scheduleReconnect()
      }
      
      this.ws.onerror = (error) => {
        console.error('❌ System State API error:', error)
        this.scheduleReconnect()
      }
      
    } catch (error) {
      console.error('❌ Failed to connect System State API:', error)
      this.scheduleReconnect()
    }
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    
    this.heartbeatInterval = setInterval(() => {
      this.sendMessage({
        type: 'heartbeat',
        timestamp: new Date()
      })
    }, 30000) // Send heartbeat every 30 seconds
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Handle incoming messages
  private handleMessage(data: any): void {
    switch (data.type) {
      case 'health':
        window.dispatchEvent(new CustomEvent('system-health-update', { 
          detail: data.payload 
        }))
        break
        
      case 'agents':
        window.dispatchEvent(new CustomEvent('agent-status-update', { 
          detail: data.payload 
        }))
        break
        
      case 'metrics':
        window.dispatchEvent(new CustomEvent('system-metrics-update', { 
          detail: data.payload 
        }))
        break
        
      case 'alert':
        window.dispatchEvent(new CustomEvent('system-alert', { 
          detail: data.payload 
        }))
        break
        
      case 'state':
        // Full system state update
        if (data.payload.health) {
          window.dispatchEvent(new CustomEvent('system-health-update', { 
            detail: data.payload.health 
          }))
        }
        if (data.payload.agents) {
          window.dispatchEvent(new CustomEvent('agent-status-update', { 
            detail: data.payload.agents 
          }))
        }
        if (data.payload.metrics) {
          window.dispatchEvent(new CustomEvent('system-metrics-update', { 
            detail: data.payload.metrics 
          }))
        }
        break
        
      case 'heartbeat-response':
        // Heartbeat response - no action needed
        console.log('💓 Heartbeat received')
        break
        
      default:
        console.log('🔍 Unknown message type:', data.type)
    }
  }

  // Send message to WebSocket
  private sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('⚠️ WebSocket not ready, message not sent:', message)
    }
  }

  // Schedule reconnection with exponential backoff
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached')
      return
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    this.reconnectAttempts++
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, delay)
  }

  // Send command to system
  sendCommand(command: string, params?: any): void {
    this.sendMessage({
      type: 'command',
      payload: { command, params, timestamp: new Date() }
    })
  }

  // Get current system state from cache
  getCurrentState(): {
    health: SystemHealth | null
    agents: AIAgentStatus[] | null
    metrics: SystemMetrics | null
    alerts: SystemAlert[] | null
  } {
    return {
      health: JSON.parse(localStorage.getItem('system-health') || 'null'),
      agents: JSON.parse(localStorage.getItem('agent-status') || 'null'),
      metrics: JSON.parse(localStorage.getItem('system-metrics') || 'null'),
      alerts: JSON.parse(localStorage.getItem('system-alerts') || 'null'),
    }
  }

  // Disconnect WebSocket
  disconnect(): void {
    this.stopHeartbeat()
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    console.log('🔌 System State API disconnected')
  }
}

// Singleton instance
export const realtimeSystemAPI = new RealtimeSystemAPI()

// React hook for consuming real-time system state
export function useRealtimeSystemState() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [agents, setAgents] = useState<AIAgentStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Load initial state from localStorage
    const initialState = realtimeSystemAPI.getCurrentState()
    if (initialState.health) setHealth(initialState.health)
    if (initialState.agents) setAgents(initialState.agents)
    if (initialState.metrics) setMetrics(initialState.metrics)
    if (initialState.alerts) setAlerts(initialState.alerts)

    // Connect to real-time updates
    realtimeSystemAPI.connect()
    setIsConnected(true)

    // Listen for system events
    const handleHealthUpdate = (event: any) => {
      setHealth(event.detail)
      localStorage.setItem('system-health', JSON.stringify(event.detail))
    }

    const handleAgentUpdate = (event: any) => {
      setAgents(event.detail)
      localStorage.setItem('agent-status', JSON.stringify(event.detail))
    }

    const handleMetricsUpdate = (event: any) => {
      setMetrics(event.detail)
      localStorage.setItem('system-metrics', JSON.stringify(event.detail))
    }

    const handleAlert = (event: any) => {
      setAlerts((prev: any) => [event.detail, ...prev.slice(0, 49)])
      
      // Store alerts in localStorage
      const existingAlerts = JSON.parse(localStorage.getItem('system-alerts') || '[]')
      existingAlerts.unshift(event.detail)
      localStorage.setItem('system-alerts', JSON.stringify(existingAlerts.slice(0, 50)))
    }

    window.addEventListener('system-health-update', handleHealthUpdate)
    window.addEventListener('agent-status-update', handleAgentUpdate)
    window.addEventListener('system-metrics-update', handleMetricsUpdate)
    window.addEventListener('system-alert', handleAlert)

    // Cleanup
    return () => {
      window.removeEventListener('system-health-update', handleHealthUpdate)
      window.removeEventListener('agent-status-update', handleAgentUpdate)
      window.removeEventListener('system-metrics-update', handleMetricsUpdate)
      window.removeEventListener('system-alert', handleAlert)
      realtimeSystemAPI.disconnect()
      setIsConnected(false)
    }
  }, [])

  return {
    health,
    agents,
    metrics,
    alerts,
    isConnected,
    acknowledgeAlert: (alertId: string) => {
      realtimeSystemAPI.sendCommand('acknowledge-alert', { alertId })
    },
    resolveAlert: (alertId: string) => {
      realtimeSystemAPI.sendCommand('resolve-alert', { alertId })
    },
    sendCommand: realtimeSystemAPI.sendCommand.bind(realtimeSystemAPI),
  }
}
