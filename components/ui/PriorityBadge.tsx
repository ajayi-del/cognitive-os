'use client'

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low'
}

const COLOR_MAP = {
  high:   { bg:'rgba(255,68,85,.12)',  border:'rgba(255,68,85,.3)',  text:'#ff7080' },
  medium: { bg:'rgba(240,176,32,.12)', border:'rgba(240,176,32,.3)', text:'#f0c060' },
  low:    { bg:'rgba(96,160,255,.12)', border:'rgba(96,160,255,.3)', text:'#7ab4ff' },
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colors = COLOR_MAP[priority]
  
  return (
    <span 
      className="inline-block px-2 py-1 rounded text-xs font-mono font-medium"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      {priority.toUpperCase()}
    </span>
  )
}
