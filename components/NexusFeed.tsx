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
    refetchIntervalInBackground: false,  // ADD THIS LINE
    staleTime: 20_000,                   // ADD THIS LINE — don't refetch if data is fresh
  })

  const unreadCount = data?.unreadCount ?? 0
  const messages = data?.messages ?? []

  // Update orb state based on messages
  useEffect(() => {
    const hasAlert = messages.some(m => m.type === 'drift' && !m.isRead)
    if (hasAlert) { setOrbState('alert'); return }
    if (unreadCount > 0) { setOrbState('unread'); return }
    setOrbState('idle')
  }, [messages, unreadCount])

  // Mark as read mutation
  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/nexus/messages?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nexus-messages'] })
  })

  // Take action mutation
  const takeAction = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      await fetch(`/api/nexus/messages?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionTaken: action, isRead: true })
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nexus-messages'] })
  })

  // Mark all read when panel opens
  const handleOpen = () => {
    setIsOpen(true)
    messages
      .filter(m => !m.isRead)
      .forEach(m => markRead.mutate(m.id))
  }

  // ─── Render message content ──────────────────────────────────────────────
  const renderContent = (msg: NexusMessage) => {
    let parsed: Record<string, unknown> = {}
    try { parsed = JSON.parse(msg.content) } catch { parsed = { text: msg.content } }

    return (
      <div style={{ fontSize: '11px', color: '#7090b0', lineHeight: '1.8' }}>
        <p>{(parsed.text || parsed.summary || parsed.description || msg.content) as string}</p>
        {msg.requiresAction && !msg.actionTaken && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              onClick={() => takeAction.mutate({ id: msg.id, action: 'approved' })}
              style={{
                padding: '4px 12px', borderRadius: '4px', fontSize: '10px',
                fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer',
                background: 'rgba(0,216,128,0.1)', border: '1px solid rgba(0,216,128,0.3)',
                color: '#00d880', letterSpacing: '0.5px'
              }}
            >
              APPROVE
            </button>
            <button
              onClick={() => takeAction.mutate({ id: msg.id, action: 'rejected' })}
              style={{
                padding: '4px 12px', borderRadius: '4px', fontSize: '10px',
                fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer',
                background: 'rgba(255,56,80,0.08)', border: '1px solid rgba(255,56,80,0.25)',
                color: '#ff3850', letterSpacing: '0.5px'
              }}
            >
              REJECT
            </button>
          </div>
        )}
        {msg.actionTaken && (
          <span style={{ fontSize: '9px', color: msg.actionTaken === 'approved' ? '#00d880' : '#ff3850', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {msg.actionTaken}
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      {/* ── Nexus Orb ────────────────────────────────────────────────────── */}
      <div
        onClick={handleOpen}
        aria-label="Open Nexus Feed"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #b0a0ff, #7060e8, #302090)',
          cursor: 'pointer', transition: 'all 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: orbState === 'idle' ? 'nexusBreath 4s ease-in-out infinite' : 'none',
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

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* ── Feed Panel ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        height: '100vh', width: '380px', zIndex: 1000,
        background: '#080e18',
        borderLeft: '1px solid rgba(80,160,255,0.12)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(80,160,255,0.08)',
          display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #b0a0ff, #7060e8, #302090)',
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-sans, sans-serif)' }}>Nexus</div>
            <div style={{ fontSize: '9px', color: '#5a7898', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '1px' }}>ANALYTICAL & INTUITIVE</div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#5a7898', cursor: 'pointer', fontSize: '18px' }}
          >×</button>
        </div>

        {/* Message list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {messages.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#2a4060', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>◉</div>
              Nexus is watching.<br />Nothing to report yet.
            </div>
          ) : (
            messages.map(msg => {
              const config = MESSAGE_CONFIG[msg.type as MessageType] ?? MESSAGE_CONFIG.insight
              return (
                <div key={msg.id} style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(80,160,255,0.05)',
                  opacity: msg.isRead && !msg.requiresAction ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{config.icon}</span>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono, monospace)', color: config.color, letterSpacing: '1px', fontWeight: 700 }}>
                      {config.label}
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#2a4060', fontFamily: 'var(--font-mono, monospace)' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#b8cce0', marginBottom: '4px', fontFamily: 'var(--font-sans, sans-serif)' }}>
                    {msg.title}
                  </div>
                  {renderContent(msg)}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(80,160,255,0.08)', flexShrink: 0 }}>
          <div style={{ fontSize: '9px', color: '#2a4060', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '1px', textAlign: 'center' }}>
            TO REPLY — USE CHAT VIEW AND SELECT NEXUS
          </div>
        </div>
      </div>

      <style>{`
        @keyframes nexusBreath {
          0%, 100% { box-shadow: 0 0 20px rgba(112,96,232,0.3), 0 0 40px rgba(112,96,232,0.1); }
          50% { box-shadow: 0 0 30px rgba(112,96,232,0.5), 0 0 60px rgba(112,96,232,0.15); }
        }
        .nexus-orb--alert {
          animation: nexusAlert 1.5s ease-in-out infinite !important;
        }
        .nexus-orb--unread {
          animation: nexusUnread 2s ease-in-out infinite !important;
        }
        @keyframes nexusAlert {
          0%, 100% { box-shadow: 0 0 25px rgba(255,56,80,0.5); }
          50% { box-shadow: 0 0 50px rgba(255,56,80,0.8), 0 0 80px rgba(255,56,80,0.3); }
        }
        @keyframes nexusUnread {
          0%, 100% { box-shadow: 0 0 25px rgba(112,96,232,0.4); }
          50% { box-shadow: 0 0 40px rgba(112,96,232,0.7), 0 0 70px rgba(112,96,232,0.25); }
        }
      `}</style>
    </>
  )
}
