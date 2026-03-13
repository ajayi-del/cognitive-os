'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ─── Types ────────────────────────────────────────────────────────────────────
type MessageType = 'briefing' | 'insight' | 'drift' | 'fix-proposal' | 'project-proposal' | 'mutation-proposal'

interface NexusMessage {
  id: string
  type: MessageType
  priority: number
  title: string
  content: string // JSON string
  isRead: boolean
  requiresAction: boolean
  actionTaken: string | null
  createdAt: string
}

// ─── Message type config ───────────────────────────────────────────────────
const MESSAGE_CONFIG: Record<MessageType, { icon: string; color: string; label: string }> = {
  'briefing':          { icon: '🌅', color: 'var(--j-green, #00d880)',   label: 'Morning Briefing'   },
  'insight':           { icon: '🌱', color: 'var(--j-cyan, #00c8f0)',    label: 'Pattern Insight'    },
  'drift':             { icon: '🔴', color: 'var(--j-red, #ff3850)',     label: 'Drift Alert'        },
  'fix-proposal':      { icon: '⚡', color: 'var(--j-gold, #e8b840)',    label: 'Fix Proposal'       },
  'project-proposal':  { icon: '📦', color: 'var(--j-purple, #8870f0)', label: 'Project Proposal'   },
  'mutation-proposal': { icon: '◈',  color: 'var(--j-blue, #3d8fff)',   label: 'Mutation Proposal'  },
}

// ─── Orb states ───────────────────────────────────────────────────────────
type OrbState = 'idle' | 'unread' | 'alert' | 'thinking'

// ─── Component ────────────────────────────────────────────────────────────
export default function NexusFeed() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [orbState, setOrbState] = useState<OrbState>('idle')
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
    refetchIntervalInBackground: false,
    staleTime: 20_000,
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

  // Update orb state based on messages
  useEffect(() => {
    if (unreadCount === 0) {
      setOrbState('idle')
    } else if (messages.some(m => m.type === 'drift' && !m.isRead)) {
      setOrbState('alert')
    } else {
      setOrbState('unread')
    }
  }, [messages, unreadCount])

  const handleOrbClick = () => {
    if (unreadCount > 0) {
      // Mark all as read when opening
      const unreadIds = messages.filter(m => !m.isRead).map(m => m.id)
      markAsRead.mutate(unreadIds)
    }
    setIsOpen(!isOpen)
    setIsMinimized(false) // Reset minimized when opening
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    setIsMaximized(false)
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    setIsMinimized(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
    setIsMaximized(false)
  }

  // Calculate dimensions based on state
  const getDimensions = () => {
    if (isMaximized) {
      return {
        width: '90vw',
        height: '90vh',
        top: '5vh',
        right: '5vw',
      }
    } else if (isMinimized) {
      return {
        width: '200px',
        height: '60px',
        top: '20px',
        right: '20px',
      }
    } else {
      return {
        width: '380px',
        height: '100vh',
        top: '0',
        right: '0',
      }
    }
  }

  const dimensions = getDimensions()

  return (
    <>
      {/* ── Nexus Orb ───────────────────────────────────────────────────── */}
      {!isOpen && (
        <div
          onClick={handleOrbClick}
          style={{
            position: 'fixed', top: '20px', right: '20px',
            width: '48px', height: '48px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #50a0ff, #1e40af)',
            boxShadow: orbState === 'alert' 
              ? '0 0 30px rgba(255,56,80,0.6), inset 0 0 20px rgba(255,255,255,0.1)'
              : '0 0 20px rgba(80,160,255,0.3), inset 0 0 15px rgba(255,255,255,0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            animation: orbState === 'idle' ? 'nexusBreath 4s ease-in-out infinite' : 'none',
            zIndex: 998,
          }}
          className={`nexus-orb nexus-orb--${orbState}`}
        >
          {/* unread badge */}
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute', top: '-2px', right: '-2px',
              width: '18px', height: '18px', borderRadius: '50%',
              background: orbState === 'alert' ? '#ff3850' : '#7060e8',
              border: '2px solid var(--j-bg, #060810)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: 700, color: '#fff',
              fontFamily: 'var(--font-mono, monospace)'
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
          {/* orb face — small N for Nexus */}
          <span style={{ fontSize: '16px', fontWeight: 900, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-sans, sans-serif)' }}>N</span>
        </div>
      )}

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      {isOpen && !isMinimized && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 997,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* ── Feed Panel ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          ...dimensions,
          background: '#080e18',
          border: isMaximized ? '2px solid rgba(80,160,255,0.3)' : '1px solid rgba(80,160,255,0.12)',
          borderRadius: isMaximized ? '12px' : '0',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 998,
        }}>
          {/* Header */}
          <div style={{
            padding: isMinimized ? '8px 12px' : '20px 20px 16px',
            borderBottom: '1px solid rgba(80,160,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}>
            {!isMinimized && (
              <>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #50a0ff, #1e40af)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                }}>
                  N
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    Nexus Feed
                  </div>
                  <div style={{ fontSize: '12px', color: '#8892b0', lineHeight: 1.2 }}>
                    {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </>
            )}
            
            {/* Window Controls */}
            <div style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}>
              <button
                onClick={handleMinimize}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(80, 160, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                −
              </button>
              <button
                onClick={handleMaximize}
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {isMaximized ? '□' : '□'}
              </button>
              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
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

          {/* Messages - Only show when not minimized */}
          {!isMinimized && (
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: isMaximized ? '0 16px' : '0 8px' 
            }}>
              {messages.length === 0 ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center', color: '#8892b0',
                  fontSize: '14px'
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
                      padding: '16px',
                      borderRadius: '12px',
                      background: message.isRead ? 'rgba(136,146,176,0.08)' : 'rgba(80,160,255,0.1)',
                      border: `1px solid ${message.isRead ? 'rgba(136,146,176,0.16)' : MESSAGE_CONFIG[message.type].color}20`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Message content - same as before */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '16px' }}>
                        {MESSAGE_CONFIG[message.type].icon}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '13px', fontWeight: 600,
                          color: message.isRead ? '#8892b0' : '#fff',
                          lineHeight: 1.3
                        }}>
                          {message.title}
                        </div>
                        <div style={{
                          fontSize: '11px', color: '#64748b',
                          lineHeight: 1.2
                        }}>
                          {MESSAGE_CONFIG[message.type].label} • {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      {!message.isRead && (
                        <div style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: MESSAGE_CONFIG[message.type].color,
                        }} />
                      )}
                    </div>

                    <div style={{
                      fontSize: '13px', color: '#cbd5e1',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {typeof message.content === 'string' 
                        ? message.content 
                        : JSON.stringify(message.content, null, 2)
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes nexusBreath {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .nexus-orb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(80,160,255,0.6);
        }
      `}</style>
    </>
  )
}
