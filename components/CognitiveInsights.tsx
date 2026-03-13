'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Brain, Lightbulb, GitBranch, AlertTriangle, TrendingUp, Network } from 'lucide-react'

interface CognitiveInsight {
  id: string
  type: 'cross_domain' | 'meta_pattern' | 'cognitive_gap' | 'synthesis'
  title: string
  description: string
  domains: string[]
  patterns: string[]
  confidence: number
  novelty: number
  timestamp: string
  actionable: boolean
  synthesisPath: string[]
}

interface CognitiveDomain {
  name: string
  health: {
    activity: number
    growth: number
    connections: number
  }
  evolution: {
    emerging: string[]
    mature: string[]
    declining: string[]
  }
  patternCount: number
}

interface SynthesisReport {
  totalDomains: number
  totalInsights: number
  crossDomainInsights: number
  metaPatterns: number
  cognitiveGaps: number
  averageNovelty: number
  averageConfidence: number
}

interface CognitiveSynthesisData {
  domains: CognitiveDomain[]
  insights: CognitiveInsight[]
  report: SynthesisReport
  evolution: {
    topDomains: string[]
    emergingPatterns: string[]
  }
}

export function CognitiveInsights() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)
  
  const { data: synthesisData, isLoading } = useQuery<CognitiveSynthesisData>({
    queryKey: ['cognitive-synthesis'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/cognitive-synthesis')
      if (!res.ok) throw new Error('Failed to fetch cognitive synthesis')
      return res.json()
    },
    refetchInterval: 12 * 60 * 60 * 1000, // Every 12 hours
    refetchIntervalInBackground: false
  })

  const insightIcons = {
    cross_domain: <GitBranch size={12} />,
    meta_pattern: <Network size={12} />,
    cognitive_gap: <AlertTriangle size={12} />,
    synthesis: <Lightbulb size={12} />
  }

  const insightColors = {
    cross_domain: '#7060e8',
    meta_pattern: '#3d8fff',
    cognitive_gap: '#f09020',
    synthesis: '#00d880'
  }

  const maturityColors = {
    emerging: '#3d8fff',
    intermediate: '#f09020',
    advanced: '#00d880'
  }

  if (isLoading || !synthesisData) {
    return (
      <div style={{ 
        padding: '12px',
        background: 'var(--j-surface)',
        border: '1px solid var(--j-bd2)',
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px'
      }}>
        <div className="j-label">COGNITIVE INSIGHTS</div>
        <div style={{ color: 'var(--j-text3)', marginTop: '4px' }}>
          ○ Synthesizing cross-domain patterns...
        </div>
      </div>
    )
  }

  const { domains, insights, report, evolution } = synthesisData || { domains: [], insights: [], report: { totalInsights: 0, totalDomains: 0, averageNovelty: 0, averageConfidence: 0 }, evolution: { topDomains: [] } }

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
        <div className="j-label">COGNITIVE INSIGHTS</div>
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

      {/* Cognitive Maturity Indicator */}
      <div style={{ 
        marginBottom: '8px',
        padding: '4px',
        background: 'rgba(112, 96, 232, 0.1)',
        borderRadius: '3px',
        textAlign: 'center'
      }}>
        <div style={{ 
          color: '#7060e8',
          fontSize: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {report.totalInsights > 5 ? 'Advanced' :
           report.totalInsights > 2 ? 'Intermediate' : 'Emerging'} Cognitive Synthesis
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Domains:</span>{' '}
          <span style={{ color: 'var(--j-purple)' }}>{report.totalDomains}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Insights:</span>{' '}
          <span style={{ color: 'var(--j-cyan)' }}>{report.totalInsights}</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Novelty:</span>{' '}
          <span style={{ color: 'var(--j-gold)' }}>{Math.round(report.averageNovelty * 100)}%</span>
        </div>
        <div>
          <span style={{ color: 'var(--j-text3)' }}>Confidence:</span>{' '}
          <span style={{ color: 'var(--j-green)' }}>{Math.round(report.averageConfidence * 100)}%</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid var(--j-bd)' 
        }}>
          {/* Top Domains */}
          {evolution.topDomains.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: 'var(--j-text3)', marginBottom: '4px' }}>TOP COGNITIVE DOMAINS</div>
              {evolution.topDomains.map((domain, index) => {
                const domainData = domains.find(d => d.name === domain)
                return (
                  <div key={domain} style={{ 
                    marginBottom: '2px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '8px'
                  }}>
                    <span style={{ color: 'var(--j-text2)' }}>{domain}</span>
                    <span style={{ color: 'var(--j-text3)' }}>
                      {domainData?.health.activity || 0} patterns
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Top Insights */}
          {insights.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: 'var(--j-text3)', marginBottom: '4px' }}>TOP COGNITIVE INSIGHTS</div>
              {insights.slice(0, 3).map((insight, index) => (
                <div key={insight.id} style={{ 
                  marginBottom: '4px',
                  padding: '4px',
                  background: insight.actionable ? 'rgba(0, 216, 128, 0.1)' : 'rgba(61, 143, 255, 0.1)',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    marginBottom: '2px'
                  }}>
                    <span style={{ color: insightColors[insight.type] }}>
                      {insightIcons[insight.type]}
                    </span>
                    <span style={{ 
                      color: 'var(--j-text2)', 
                      fontSize: '8px',
                      textTransform: 'uppercase'
                    }}>
                      {insight.type.replace('_', ' ')}
                    </span>
                    {insight.actionable && (
                      <span style={{ 
                        color: '#00d880', 
                        fontSize: '7px',
                        background: 'rgba(0, 216, 128, 0.2)',
                        padding: '1px 3px',
                        borderRadius: '2px'
                      }}>
                        ACTIONABLE
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    color: 'var(--j-text3)', 
                    fontSize: '7px',
                    marginBottom: '2px'
                  }}>
                    {insight.title}
                  </div>
                  
                  {selectedInsight === insight.id && (
                    <div style={{ 
                      marginTop: '4px',
                      paddingTop: '4px',
                      borderTop: '1px solid var(--j-bd)',
                      fontSize: '7px'
                    }}>
                      <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>
                        {insight.description}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ color: 'var(--j-text3)' }}>
                          Domains: {insight.domains.join(', ')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--j-text3)' }}>
                          Confidence: {Math.round(insight.confidence * 100)}%
                        </span>
                        <span style={{ color: 'var(--j-text3)' }}>
                          Novelty: {Math.round(insight.novelty * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Emerging Patterns */}
          {evolution.emergingPatterns.length > 0 && (
            <div>
              <div style={{ color: 'var(--j-text3)', marginBottom: '4px' }}>EMERGING PATTERNS</div>
              {evolution.emergingPatterns.map((pattern, index) => (
                <div key={index} style={{ 
                  color: 'var(--j-text2)', 
                  fontSize: '7px',
                  marginBottom: '2px'
                }}>
                  • {pattern}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
