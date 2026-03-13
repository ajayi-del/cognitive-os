'use client'

interface DriftRingProps {
  alignment: number // 0-100
  size?: number
  strokeWidth?: number
}

export function DriftRing({ alignment, size = 90, strokeWidth = 8 }: DriftRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - alignment / 100)
  
  // Color based on alignment
  const strokeColor = alignment >= 80 ? '#00e896' : alignment >= 60 ? '#f0b020' : '#ff4455'
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ fontSize: size * 0.18 }}
      >
        <div className="font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {alignment}%
        </div>
        <div className="text-xs text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          ALIGNED
        </div>
      </div>
    </div>
  )
}
