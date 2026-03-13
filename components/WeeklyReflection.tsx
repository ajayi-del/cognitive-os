'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, TrendingUp, Activity, Brain, ChevronDown, ChevronUp } from 'lucide-react'

interface WeeklySummary {
  period: string
  metrics: {
    captures: {
      thisWeek: number
      lastWeek: number
      growth: number
      trend: 'increasing' | 'decreasing'
    }
    actions: {
      completed: number
      completionRate: string
    }
    patterns: {
      active: number
      topThemes: Array<{ theme: string; occurrences: number }>
    }
    messages: Record<string, number>
  }
  organismHealth: {
    status: string
    recommendation: string
  }
  reflection: string
  generatedAt: string
}

export function WeeklyReflection() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { data: summary, isLoading } = useQuery<WeeklySummary>({
    queryKey: ['weekly-summary'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/weekly-summary')
      if (!res.ok) throw new Error('Failed to fetch weekly summary')
      return res.json()
    },
    refetchInterval: 60 * 60 * 1000, // Every hour
    refetchIntervalInBackground: false
  })

  if (isLoading || !summary) {
    return (
      <div style={{ 
        padding: '12px',
        background: 'var(--j-surface)',
        border: '1px solid var(--j-bd2)',
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px'
      }}>
        <div className="j-label">WEEKLY REFLECTION</div>
        <div style={{ color: 'var(--j-text3)', marginTop: '4px' }}>
          ○ Analyzing organism growth...
        </div>
      </div>
    )
  }

  const healthColors = {
    thriving: '#00d880',
    balanced: '#3d8fff', 
    needs_input: '#f09020'
  }

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
        <div className="j-label">WEEKLY REFLECTION</div>
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
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Quick Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Captures:</span>{' '}
          <span style={{ 
            color: summary.metrics.captures.trend === 'increasing' ? 'var(--j-green)' : 'var(--j-amber)' 
          }}>
            {summary.metrics.captures.thisWeek}
            {summary.metrics.captures.growth !== 0 && (
              <span style={{ fontSize: '8px', marginLeft: '2px' }}>
                ({summary.metrics.captures.growth > 0 ? '+' : ''}{summary.metrics.captures.growth}%)
              </span>
            )}
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Actions:</span>{' '}
          <span style={{ color: 'var(--j-cyan)' }}>{summary.metrics.actions.completed}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid var(--j-bd)' 
        }}>
          {/* Top Themes */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>TOP THEMES</div>
            {summary.metrics.patterns.topThemes.map((theme, index) => (
              <div key={index} style={{ fontSize: '8px', color: 'var(--j-text2)' }}>
                • {theme.theme} ({theme.occurrences}x)
              </div>
            ))}
          </div>

          {/* Organism Health */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>ORGANISM HEALTH</div>
            <div style={{ 
              color: healthColors[summary.organismHealth.status as keyof typeof healthColors] || 'var(--j-text2)',
              fontSize: '8px'
            }}>
              Status: {summary.organismHealth.status}
            </div>
            <div style={{ color: 'var(--j-text3)', fontSize: '8px', marginTop: '2px' }}>
              {summary.organismHealth.recommendation}
            </div>
          </div>

          {/* Message Activity */}
          <div>
            <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>NEXUS ACTIVITY</div>
            {Object.entries(summary.metrics.messages).map(([type, count]) => (
              <span key={type} style={{ 
                fontSize: '8px', 
                color: 'var(--j-text2)', 
                marginRight: '8px' 
              }}>
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
