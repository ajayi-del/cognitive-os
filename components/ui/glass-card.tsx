'use client'

import { forwardRef } from 'react'
import { clsx, type ClassValue } from 'clsx'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
  glow?: boolean
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink'
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'default', glow = false, gradient, ...props }, ref) => {
    const baseClasses = 'backdrop-blur-xl transition-all duration-300'
    
    const variantClasses = {
      default: 'bg-white/5 border border-white/10',
      elevated: 'bg-white/10 border border-white/20 shadow-2xl',
      bordered: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/30'
    }
    
    const gradientClasses = gradient ? {
      blue: 'from-blue-500/20 to-cyan-500/20',
      purple: 'from-purple-500/20 to-pink-500/20',
      green: 'from-green-500/20 to-emerald-500/20',
      orange: 'from-orange-500/20 to-red-500/20',
      pink: 'from-pink-500/20 to-purple-500/20'
    } : {}
    
    const glowClasses = glow ? 'shadow-2xl shadow-purple-500/20' : ''
    
    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          gradient && gradientClasses[gradient],
          glowClasses,
          'rounded-3xl p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export { GlassCard }
