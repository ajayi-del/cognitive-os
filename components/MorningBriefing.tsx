// MORNING BRIEFING COMPONENT
// Real morning briefing with DeepSeek integration

'use client'

import { useState, useEffect } from 'react'
import { Calendar, Target, AlertTriangle, TrendingUp, Clock } from 'lucide-react'
import { callAI } from '@/lib/ai-providers-SIMPLIFIED'

interface BriefingData {
  focusAreas: string[]
  recentPatterns: string[]
  priorities: string[]
  driftAlerts: string[]
  timestamp: Date
}

export default function MorningBriefing() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateBriefing = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await callAI({
        messages: [
          {
            role: 'user',
            content: `You are Nexus, providing a morning briefing. Current date: ${new Date().toLocaleDateString()}. 
            Generate a comprehensive morning briefing in JSON format with these exact keys:
            {
              "focusAreas": ["3 main focus areas for today"],
              "recentPatterns": ["2-3 patterns noticed recently"],
              "priorities": ["3 top priorities for today"],
              "driftAlerts": ["any drift alerts or concerns"]
            }
            Be specific, actionable, and concise. Focus on what matters most.`
          },
          {
            role: 'user',
            content: "Please provide my morning briefing for today in the requested JSON format."
          }
        ]
      })

      // Parse the JSON response
      let briefingData
      try {
        briefingData = JSON.parse(response.content)
      } catch (parseError) {
        // If JSON parsing fails, create structured data from text
        const content = response.content
        briefingData = {
          focusAreas: content.includes('focus') ? [content.split('\n').find(l => l.includes('focus'))?.trim() || 'Focus on core objectives'] : ['Focus on core objectives'],
          recentPatterns: content.includes('pattern') ? [content.split('\n').find(l => l.includes('pattern'))?.trim() || 'Review recent activities'] : ['Review recent activities'],
          priorities: content.includes('priority') ? [content.split('\n').find(l => l.includes('priority'))?.trim() || 'Complete high-priority tasks'] : ['Complete high-priority tasks'],
          driftAlerts: content.includes('drift') ? [content.split('\n').find(l => l.includes('drift'))?.trim() || 'Monitor alignment'] : ['Monitor alignment']
        }
      }

      setBriefing({
        ...briefingData,
        timestamp: new Date()
      })

    } catch (err) {
      console.error('Briefing generation error:', err)
      setError('Failed to generate briefing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateBriefing()
  }, [])

  if (isLoading) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: '#8892b0',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🌅</div>
        <div style={{ fontSize: '16px' }}>Generating morning briefing...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: '#ef4444',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>⚠️</div>
        <div style={{ fontSize: '16px', marginBottom: '16px' }}>{error}</div>
        <button
          onClick={generateBriefing}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!briefing) {
    return null
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(8, 14, 24, 0.95)',
      borderRadius: '12px',
      border: '1px solid rgba(80, 160, 255, 0.2)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(80, 160, 255, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '18px',
          }}>
            🌅
          </div>
          <div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>
              Morning Briefing
            </h2>
            <p style={{ color: '#8892b0', margin: '4px 0 0 0', fontSize: '12px' }}>
              {briefing.timestamp.toLocaleDateString()} • {briefing.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={generateBriefing}
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '6px',
            padding: '6px 12px',
            color: '#fff',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      {/* Focus Areas */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <Target size={16} style={{ color: '#3b82f6' }} />
          <h3 style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
            Today's Focus Areas
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {briefing.focusAreas.map((area, index) => (
            <div
              key={index}
              style={{
                padding: '8px 12px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#3b82f6',
              }} />
              {area}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Patterns */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <TrendingUp size={16} style={{ color: '#10b981' }} />
          <h3 style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
            Recent Patterns
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {briefing.recentPatterns.map((pattern, index) => (
            <div
              key={index}
              style={{
                padding: '8px 12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
              }} />
              {pattern}
            </div>
          ))}
        </div>
      </div>

      {/* Top Priorities */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <Calendar size={16} style={{ color: '#f59e0b' }} />
          <h3 style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
            Top Priorities
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {briefing.priorities.map((priority, index) => (
            <div
              key={index}
              style={{
                padding: '8px 12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#f59e0b',
              }} />
              {priority}
            </div>
          ))}
        </div>
      </div>

      {/* Drift Alerts */}
      {briefing.driftAlerts.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <AlertTriangle size={16} style={{ color: '#ef4444' }} />
            <h3 style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
              Drift Alerts
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {briefing.driftAlerts.map((alert, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '6px',
                  color: '#cbd5e1',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ef4444',
                }} />
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(80, 160, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#8892b0',
        fontSize: '12px',
      }}>
        <Clock size={12} />
        Generated by Nexus • DeepSeek AI
      </div>
    </div>
  )
}
