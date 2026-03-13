'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Network, Brain, GitBranch, AlertTriangle, TrendingUp } from 'lucide-react'

interface PatternNode {
  id: string
  label: string
  size: number
  color: string
  stage: 'observation' | 'repetition' | 'crystallization'
  occurrences: number
  growthRate: number
}

interface PatternEdge {
  source: string
  target: string
  weight: number
}

interface PatternCluster {
  name: string
  patterns: string[]
  size: number
}

interface PatternGraphData {
  nodes: PatternNode[]
  edges: PatternEdge[]
  clusters: PatternCluster[]
}

interface AdaptationSignal {
  type: 'convergence' | 'divergence' | 'stagnation' | 'promotion'
  patterns: string[]
  confidence: number
  message: string
  timestamp: string
}

export function PatternGraph() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  
  const { data: adaptationData, isLoading } = useQuery<{
    patternGraph: PatternGraphData
    signals: AdaptationSignal[]
    reorganizationActions: string[]
    summary: any
  }>({
    queryKey: ['pattern-adaptation'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/adaptation')
      if (!res.ok) throw new Error('Failed to fetch adaptation data')
      return res.json()
    },
    refetchInterval: 6 * 60 * 60 * 1000, // Every 6 hours
    refetchIntervalInBackground: false
  })

  const stageColors = {
    observation: '#3d8fff',
    repetition: '#f09020',
    crystallization: '#7060e8'
  }

  const signalIcons = {
    convergence: <GitBranch size={12} />,
    divergence: <Network size={12} />,
    stagnation: <AlertTriangle size={12} />,
    promotion: <TrendingUp size={12} />
  }

  if (isLoading || !adaptationData) {
    return (
      <div style={{ 
        padding: '12px',
        background: 'var(--j-surface)',
        border: '1px solid var(--j-bd2)',
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px'
      }}>
        <div className="j-label">PATTERN GRAPH</div>
        <div style={{ color: 'var(--j-text3)', marginTop: '4px' }}>
          ○ Analyzing pattern evolution...
        </div>
      </div>
    )
  }

  const { patternGraph, signals, reorganizationActions, summary } = adaptationData

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
        <div className="j-label">PATTERN GRAPH</div>
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

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Patterns:</span>{' '}
          <span style={{ color: 'var(--j-purple)' }}>{summary.totalPatterns}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Clusters:</span>{' '}
          <span style={{ color: 'var(--j-cyan)' }}>{summary.totalClusters}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Signals:</span>{' '}
          <span style={{ color: 'var(--j-gold)' }}>{summary.signalsDetected}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Actions:</span>{' '}
          <span style={{ color: 'var(--j-green)' }}>{summary.adaptationActions}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid var(--j-bd)' 
        }}>
          {/* Pattern Clusters */}
          {patternGraph.clusters.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: 'var(--j-text3)', marginBottom: '4px' }}>PATTERN CLUSTERS</div>
              {patternGraph.clusters.map((cluster, index) => (
                <div key={cluster.name} style={{ marginBottom: '4px' }}>
                  <div 
                    style={{ 
                      color: 'var(--j-text2)', 
                      fontSize: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedCluster(selectedCluster === cluster.name ? null : cluster.name)}
                  >
                    {selectedCluster === cluster.name ? '▼' : '▶'} {cluster.name} ({cluster.size} patterns)
                  </div>
                  {selectedCluster === cluster.name && (
                    <div style={{ marginLeft: '12px', marginTop: '2px' }}>
                      {cluster.patterns.map((pattern, i) => (
                        <div key={i} style={{ 
                          color: 'var(--j-text3)', 
                          fontSize: '7px',
                          marginBottom: '1px'
                        }}>
                          • {pattern}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Adaptation Signals */}
          {signals.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: 'var(--j-text3)', marginBottom: '4px' }}>ADAPTATION SIGNALS</div>
              {signals.slice(0, 3).map((signal, index) => (
                <div key={index} style={{ 
                  marginBottom: '4px',
                  padding: '4px',
                  background: signal.type === 'promotion' ? 'rgba(112, 96, 232, 0.1)' :
                               signal.type === 'stagnation' ? 'rgba(240, 144, 32, 0.1)' :
                               'rgba(61, 143, 255, 0.1)',
                  borderRadius: '3px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    marginBottom: '2px'
                  }}>
                    <span style={{ color: stageColors[signal.type === 'promotion' ? 'crystallization' : 'observation'] }}>
                      {signalIcons[signal.type]}
                    </span>
                    <span style={{ 
                      color: 'var(--j-text2)', 
                      fontSize: '8px',
                      textTransform: 'uppercase'
                    }}>
                      {signal.type}
                    </span>
                    <span style={{ 
                      color: 'var(--j-text3)', 
                      fontSize: '7px'
                    }}>
                      ({Math.round(signal.confidence * 100)}%)
                    </span>
                  </div>
                  <div style={{ 
                    color: 'var(--j-text3)', 
                    fontSize: '7px',
                    fontStyle: 'italic'
                  }}>
                    {signal.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reorganization Actions */}
          {reorganizationActions.length > 0 && (
            <div>
              <div style={{ color: 'var(--j-text3)', marginBottom: '4px' }}>REORGANIZATION ACTIONS</div>
              {reorganizationActions.slice(0, 3).map((action, index) => (
                <div key={index} style={{ 
                  color: 'var(--j-text2)', 
                  fontSize: '7px',
                  marginBottom: '2px'
                }}>
                  • {action}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
