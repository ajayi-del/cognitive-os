'use client'

interface StatusBadgeProps {
  status: 'pending' | 'active' | 'done' | 'processing'
}

const STATUS_MAP = {
  pending:  { bg:'rgba(255,255,255,.06)', border:'rgba(255,255,255,.1)', text:'#6880a0' },
  active:   { bg:'rgba(0,232,150,.1)',    border:'rgba(0,232,150,.25)', text:'#40e89a' },
  done:     { bg:'rgba(0,232,150,.06)',   border:'rgba(0,232,150,.15)', text:'#2a8060' },
  processing: { bg:'rgba(64,144,255,.1)', border:'rgba(64,144,255,.25)', text:'#7ab4ff' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = STATUS_MAP[status]
  
  return (
    <span 
      className="inline-block px-2 py-1 rounded text-xs font-mono font-medium"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      {status.toUpperCase()}
    </span>
  )
}
