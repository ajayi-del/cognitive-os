'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react'

interface DecisionTrait {
  patience_score: number
  aggression_score: number
  confirmation_discipline: number
  recovery_quality: number
  overextension_risk: number
  defensive_discipline: number
  timing_precision: number
}

interface CrossDomainInsight {
  id: string
  pattern_type: 'consistency' | 'contradiction' | 'strength' | 'weakness'
  domains: string[]
  observed_behavior: string
  possible_interpretation: string
  suggested_correction: string
  confidence: number
  evidence: {
    chess?: string
    trading?: string
    system_design?: string
  }
  timestamp: string
}

interface DecisionPatternsData {
  domain_patterns: {
    chess: any
    trading?: any
    system_design?: any
  }
  decision_traits: DecisionTrait
  cross_domain_insights: CrossDomainInsight[]
  data_sources: {
    chess_games: number
    trading_records: number
    system_projects: number
  }
  confidence_threshold: number
}

export function DecisionPatterns() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)
  
  const { data: patternsData, isLoading } = useQuery<DecisionPatternsData>({
    queryKey: ['decision-patterns'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/decision-patterns')
      if (!res.ok) throw new Error('Failed to fetch decision patterns')
      return res.json()
    },
    refetchInterval: 12 * 60 * 60 * 1000, // Every 12 hours
    refetchIntervalInBackground: false
  })

  const insightIcons = {
    consistency: <CheckCircle size={12} />,
    contradiction: <AlertTriangle size={12} />,
    strength: <TrendingUp size={12} />,
    weakness: <AlertTriangle size={12} />
  }

  const insightColors = {
    consistency: '#00d880',
    contradiction: '#f09020',
    strength: '#7060e8',
    weakness: '#ff3850'
  }

  if (isLoading || !patternsData) {
    return (
      <div style={{ 
        padding: '12px',
        background: 'var(--j-surface)',
        border: '1px solid var(--j-bd2)',
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px'
      }}>
        <div className="j-label">DECISION PATTERNS</div>
        <div style={{ color: 'var(--j-text3)', marginTop: '4px' }}>
          ○ Analyzing cross-domain decision behavior...
        </div>
      </div>
    )
  }

  const { decision_traits, cross_domain_insights, data_sources } = patternsData || { decision_traits: { patience_score: 0, aggression_score: 0, confirmation_discipline: 0, recovery_quality: 0, overextension_risk: 0, defensive_discipline: 0, timing_precision: 0 }, cross_domain_insights: [], data_sources: { chess_games: 0, trading_records: 0, system_projects: 0 } }

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
        <div className="j-label">DECISION PATTERNS</div>
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

      {/* Data Sources Summary */}
      <div style={{ 
        marginBottom: '8px',
        padding: '4px',
        background: 'rgba(112, 96, 232, 0.1)',
        borderRadius: '3px',
        fontSize: '8px'
      }}>
        <div style={{ color: '#7060e8', marginBottom: '2px' }}>
          DATA SOURCES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
          <div>
            <span style={{ color: 'var(--j-text3)' }}>Chess:</span>{' '}
            <span style={{ color: 'var(--j-text)' }}>{data_sources.chess_games}</span>
          </div>
          <div>
            <span style={{ color: 'var(--j-text3)' }}>Trading:</span>{' '}
            <span style={{ color: 'var(--j-text)' }}>{data_sources.trading_records}</span>
          </div>
          <div>
            <span style={{ color: 'var(--j-text3)' }}>Projects:</span>{' '}
            <span style={{ color: 'var(--j-text)' }}>{data_sources.system_projects}</span>
          </div>
        </div>
      </div>

      {/* Decision Traits Summary */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: 'var(--j-text3)', marginBottom: '4px', fontSize: '8px' }}>
          DECISION TRAITS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <div>
            <span style={{ color: 'var(--j-text3)' }}>Patience:</span>{' '}
            <span style={{ 
              color: decision_traits.patience_score > 0.7 ? '#00d880' : 
                     decision_traits.patience_score < 0.3 ? '#ff3850' : '#f09020'
            }}>
              {Math.round(decision_traits.patience_score * 100)}%
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--j-text3)' }}>Aggression:</span>{' '}
            <span style={{ 
              color: decision_traits.aggression_score > 0.7 ? '#ff3850' : 
                     decision_traits.aggression_score < 0.3 ? '#00d880' : '#f09020'
            }}>
              {Math.round(decision_traits.aggression_score * 100)}%
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--j-text3)' }}>Discipline:</span>{' '}
            <span style={{ 
              color: decision_traits.confirmation_discipline > 0.7 ? '#00d880' : 
                     decision_traits.confirmation_discipline < 0.3 ? '#ff3850' : '#f09020'
            }}>
              {Math.round(decision_traits.confirmation_discipline * 100)}%
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--j-text3)' }}>Recovery:</span>{' '}
            <span style={{ 
              color: decision_traits.recovery_quality > 0.7 ? '#00d880' : 
                     decision_traits.recovery_quality < 0.3 ? '#ff3850' : '#f09020'
            }}>
              {Math.round(decision_traits.recovery_quality * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Top Insights */}
      {cross_domain_insights.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--j-text3)', marginBottom: '4px', fontSize: '8px' }}>
            CROSS-DOMAIN INSIGHTS ({cross_domain_insights.length})
          </div>
          {cross_domain_insights.slice(0, 2).map((insight, index) => (
            <div key={insight.id} style={{ 
              marginBottom: '4px',
              padding: '4px',
              background: insight.pattern_type === 'strength' ? 'rgba(0, 216, 128, 0.1)' : 
                         insight.pattern_type === 'weakness' ? 'rgba(255, 56, 80, 0.1)' :
                         'rgba(240, 144, 32, 0.1)',
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
                <span style={{ color: insightColors[insight.pattern_type] }}>
                  {insightIcons[insight.pattern_type]}
                </span>
                <span style={{ 
                  color: 'var(--j-text2)', 
                  fontSize: '8px',
                  textTransform: 'uppercase'
                }}>
                  {insight.pattern_type}
                </span>
                <span style={{ 
                  color: 'var(--j-text3)', 
                  fontSize: '7px',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '1px 3px',
                  borderRadius: '2px'
                }}>
                  {Math.round(insight.confidence * 100)}%
                </span>
              </div>
              <div style={{ 
                color: 'var(--j-text3)', 
                fontSize: '7px',
                marginBottom: '2px'
              }}>
                {insight.observed_behavior}
              </div>
              
              {selectedInsight === insight.id && (
                <div style={{ 
                  marginTop: '4px',
                  paddingTop: '4px',
                  borderTop: '1px solid var(--j-bd)',
                  fontSize: '7px'
                }}>
                  <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>
                    <strong>Interpretation:</strong> {insight.possible_interpretation}
                  </div>
                  <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>
                    <strong>Suggestion:</strong> {insight.suggested_correction}
                  </div>
                  <div style={{ color: 'var(--j-text3)', marginBottom: '2px' }}>
                    <strong>Evidence:</strong>
                  </div>
                  {Object.entries(insight.evidence).map(([domain, evidence]) => (
                    <div key={domain} style={{ marginLeft: '8px', color: 'var(--j-text2)' }}>
                      • {domain}: {evidence}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid var(--j-bd)' 
        }}>
          {/* All Decision Traits */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ color: 'var(--j-text3)', marginBottom: '4px', fontSize: '8px' }}>
              ALL DECISION TRAITS
            </div>
            <div style={{ fontSize: '7px', lineHeight: '1.4' }}>
              {Object.entries(decision_traits).map(([trait, score]) => (
                <div key={trait} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '2px',
                  padding: '2px 4px',
                  background: score > 0.7 ? 'rgba(0, 216, 128, 0.1)' : 
                             score < 0.3 ? 'rgba(255, 56, 80, 0.1)' : 'rgba(240, 144, 32, 0.1)'
                }}>
                  <span style={{ color: 'var(--j-text2)' }}>
                    {trait.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span style={{ 
                    color: score > 0.7 ? '#00d880' : 
                           score < 0.3 ? '#ff3850' : '#f09020'
                  }}>
                    {Math.round(score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* All Insights */}
          {cross_domain_insights.length > 2 && (
            <div>
              <div style={{ color: 'var(--j-text3)', marginBottom: '4px', fontSize: '8px' }}>
                ALL INSIGHTS
              </div>
              {cross_domain_insights.slice(2).map((insight, index) => (
                <div key={insight.id} style={{ 
                  marginBottom: '2px',
                  padding: '2px 4px',
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: '2px',
                  fontSize: '7px'
                }}>
                  <span style={{ color: insightColors[insight.pattern_type] }}>
                    {insightIcons[insight.pattern_type]}
                  </span>{' '}
                  {insight.observed_behavior}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
