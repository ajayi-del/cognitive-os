// CLEAN NEXUS FEED - NOISE REMOVED
// Focus on essential features only

'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Simplified message types - only what's needed
type MessageType = 'briefing' | 'insight' | 'drift' | 'alert'

interface NexusMessage {
  id: string
  type: MessageType
  title: string
  content: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
  read: boolean
}

// Simplified message config
const MESSAGE_CONFIG = {
  briefing: { icon: '🌅', color: '#10b981', label: 'Morning Briefing' },
  insight: { icon: '🌱', color: '#3b82f6', label: 'Pattern Insight' },
  drift: { icon: '🔴', color: '#ef4444', label: 'Drift Alert' },
  alert: { icon: '⚡', color: '#f59e0b', label: 'Alert' }
}

export default function CleanNexusFeed() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const queryClient = useQueryClient()

  // Fetch messages
  const { data } = useQuery({
    queryKey: ['nexus-messages'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/messages')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{ messages: NexusMessage[]; unreadCount: number }>
    },
    refetchInterval: 30_000,
  })

  const messages = data?.messages || []
  const unreadCount = data?.unreadCount || 0

  // Mark as read mutation
  const markAsRead = useMutation({
    mutationFn: async (messageIds: string[]) => {
      const res = await fetch('/api/nexus/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds })
      })
      if (!res.ok) throw new Error('Failed to mark as read')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nexus-messages'] })
    }
  })

  const handleOrbClick = () => {
    if (unreadCount > 0) {
      const unreadIds = messages.filter(m => !m.read).map(m => m.id)
      markAsRead.mutate(unreadIds)
    }
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  return (
    <>
      {/* Nexus Orb */}
      {!isOpen && (
        <div
          onClick={handleOrbClick}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #50a0ff, #1e40af)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 998,
            boxShadow: unreadCount > 0 
              ? '0 0 20px rgba(255,56,80,0.6)' 
              : '0 0 20px rgba(80,160,255,0.3)',
          }}
        >
          {/* Unread indicator */}
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #060810',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 700,
              color: '#fff',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
          
          {/* Nexus icon */}
          <div style={{
            fontSize: '16px',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            lineHeight: '48px',
          }}>
            N
          </div>
        </div>
      )}

      {/* Nexus Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 997,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)'
            }}
          />

          {/* Feed Panel */}
          <div style={{
            position: 'fixed',
            top: isMinimized ? '20px' : '0',
            right: '0',
            height: isMinimized ? '60px' : '100vh',
            width: isMinimized ? '200px' : '380px',
            background: '#080e18',
            borderLeft: '1px solid rgba(80,160,255,0.12)',
            zIndex: 998,
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
          }}>
            {/* Header */}
            <div style={{
              padding: isMinimized ? '8px 12px' : '16px 20px',
              borderBottom: '1px solid rgba(80,160,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              {!isMinimized && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #50a0ff, #1e40af)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}>
                      N
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                        Nexus
                      </div>
                      <div style={{ fontSize: '11px', color: '#8892b0' }}>
                        {unreadCount} unread
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Controls */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={handleMinimize}
                  style={{
                    background: 'rgba(59,130,246,0.2)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {isMinimized ? '□' : '−'}
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 8px',
              }}>
                {messages.length === 0 ? (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#8892b0',
                    fontSize: '14px',
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>📭</div>
                    No messages yet. Nexus is monitoring your patterns...
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        margin: '8px 12px',
                        padding: '12px',
                        borderRadius: '8px',
                        background: message.read 
                          ? 'rgba(136,146,176,0.08)' 
                          : 'rgba(80,160,255,0.1)',
                        border: `1px solid ${message.read 
                          ? 'rgba(136,146,176,0.16)' 
                          : MESSAGE_CONFIG[message.type].color}20`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Message header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}>
                        <span style={{ fontSize: '14px' }}>
                          {MESSAGE_CONFIG[message.type].icon}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: message.read ? '#8892b0' : '#fff',
                            lineHeight: 1.3,
                          }}>
                            {message.title}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#64748b',
                            lineHeight: 1.2,
                          }}>
                            {MESSAGE_CONFIG[message.type].label} • {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        {!message.read && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: MESSAGE_CONFIG[message.type].color,
                          }} />
                        )}
                      </div>

                      {/* Message content */}
                      <div style={{
                        fontSize: '13px',
                        color: '#cbd5e1',
                        lineHeight: 1.4,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
