'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity, AlertTriangle, CheckCircle, Brain, TrendingUp } from 'lucide-react'

interface OrganismHealth {
  cognitivePressure: 'low' | 'medium' | 'high'
  executionGap: number
  systemStability: number
  architecturalIntegrity: 'ok' | 'warning' | 'critical'
  messages: string[]
  timestamp: string
}

export function OrganismStatus() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { data: health, isLoading } = useQuery<OrganismHealth>({
    queryKey: ['organism-health'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/organism-health')
      if (!res.ok) throw new Error('Failed to fetch organism health')
      return res.json()
    },
    refetchInterval: 5 * 60 * 1000, // Every 5 minutes
    refetchIntervalInBackground: false
  })

  // Get capture count for display
  const { data: capturesData } = useQuery({
    queryKey: ['captures-count'],
    queryFn: async () => {
      const res = await fetch('/api/captures')
      if (!res.ok) throw new Error('Failed to fetch captures')
      const captures = await res.json()
      return captures.length
    },
    refetchInterval: 30_000
  })

  // Get pattern formation progress
  const { data: patternsData } = useQuery({
    queryKey: ['patterns-progress'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/messages')
      if (!res.ok) return { patterns: [] }
      const data = await res.json()
      return {
        insights: data.messages.filter((m: any) => m.type === 'insight').length,
        proposals: data.messages.filter((m: any) => m.type === 'project-proposal').length
      }
    },
    refetchInterval: 60_000
  })

  const healthColors = {
    thriving: '#00d880',
    balanced: '#3d8fff', 
    drift: '#f09020',
    critical: '#ff3850'
  }

  const pressureColors = {
    low: '#00d880',
    medium: '#f09020',
    high: '#ff3850'
  }

  const integrityColors = {
    ok: '#00d880',
    warning: '#f09020',
    critical: '#ff3850'
  }

  if (isLoading || !health) {
    return (
      <div style={{ 
        padding: '12px',
        background: 'var(--j-surface)',
        border: '1px solid var(--j-bd2)',
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px'
      }}>
        <div className="j-label">ORGANISM STATUS</div>
        <div style={{ color: 'var(--j-text3)', marginTop: '4px' }}>
          ○ Scanning organism health...
        </div>
      </div>
    )
  }

  const overallHealthScore = Math.round(
    (health.systemStability + 
    (health.cognitivePressure === 'low' ? 100 : health.cognitivePressure === 'medium' ? 70 : 40) +
    (health.architecturalIntegrity === 'ok' ? 100 : health.architecturalIntegrity === 'warning' ? 70 : 40)) / 3
  )

  return (
    <div style={{ 
      padding: '12px',
      background: 'var(--j-surface)',
      border: '1px solid var(--j-bd2)',
      borderRadius: '6px',
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      lineHeight: '1.6'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <div className="j-label">ORGANISM STATUS</div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--j-text2)', 
            cursor: 'pointer',
            padding: '2px'
          }}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Overall Health Score */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        marginBottom: '8px',
        color: overallHealthScore > 80 ? healthColors.thriving : 
               overallHealthScore > 60 ? healthColors.balanced : 
               healthColors.critical
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: overallHealthScore > 80 ? healthColors.thriving : 
                     overallHealthScore > 60 ? healthColors.balanced : 
                     healthColors.critical
        }} />
        <span style={{ 
          fontWeight: 700, 
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Health: {overallHealthScore}%
        </span>
      </div>
      
      {/* Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Diary:</span>{' '}
          <span style={{ color: 'var(--j-cyan)' }}>{capturesData || 0}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Patterns:</span>{' '}
          <span style={{ color: 'var(--j-purple)' }}>{patternsData?.insights || 0}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Actions:</span>{' '}
          <span style={{ color: 'var(--j-green)' }}>{health.executionGap}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Stability:</span>{' '}
          <span style={{ color: health.systemStability > 80 ? '#00d880' : health.systemStability > 60 ? '#f09020' : '#ff3850' }}>
            {health.systemStability}%
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid var(--j-bd)' 
        }}>
          {/* Cognitive Pressure */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>COGNITIVE PRESSURE</div>
            <div style={{ 
              color: pressureColors[health.cognitivePressure],
              fontSize: '8px',
              textTransform: 'uppercase'
            }}>
              {health.cognitivePressure}
            </div>
          </div>

          {/* Execution Gap */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>EXECUTION GAP</div>
            <div style={{ 
              color: health.executionGap > 3 ? '#ff3850' : health.executionGap > 1 ? '#f09020' : '#00d880',
              fontSize: '8px'
            }}>
              {health.executionGap} patterns without actions
            </div>
          </div>

          {/* Architectural Integrity */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>ARCHITECTURAL INTEGRITY</div>
            <div style={{ 
              color: integrityColors[health.architecturalIntegrity],
              fontSize: '8px',
              textTransform: 'uppercase'
            }}>
              {health.architecturalIntegrity}
            </div>
          </div>

          {/* Health Messages */}
          {health.messages && health.messages.length > 0 && (
            <div>
              <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>HEALTH MESSAGES</div>
              {health.messages.map((message, index) => (
                <div key={index} style={{ 
                  color: 'var(--j-text2)', 
                  fontSize: '8px',
                  marginBottom: '2px',
                  fontStyle: 'italic'
                }}>
                  • {message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
