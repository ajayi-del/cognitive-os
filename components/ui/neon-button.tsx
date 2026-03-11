'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'gradient'
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    glow = false, 
    disabled = false, 
    loading = false,
    icon,
    gradient,
    ...props 
  }, ref) => {
    const baseClasses = 'relative overflow-hidden transition-all duration-300 font-semibold'
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-2xl',
      lg: 'px-8 py-4 text-lg rounded-3xl',
      xl: 'px-10 py-5 text-xl rounded-3xl'
    }
    
    const variantClasses = {
      primary: 'text-white border-2 border-transparent',
      secondary: 'text-white/80 border-2 border-white/20 hover:text-white hover:border-white/40',
      accent: 'text-purple-300 border-2 border-purple-400/50 hover:text-purple-200 hover:border-purple-400/70',
      danger: 'text-red-300 border-2 border-red-400/50 hover:text-red-200 hover:border-red-400/70',
      success: 'text-green-300 border-2 border-green-400/50 hover:text-green-200 hover:border-green-400/70'
    }
    
    const gradientClasses = gradient ? {
      blue: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      purple: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      green: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      orange: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
      pink: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600',
      gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
    } : gradient ? {} : {
      primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      secondary: 'bg-white/10 backdrop-blur-xl hover:bg-white/20',
      accent: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
      danger: 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600',
      success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
    }
    
    const stateClasses = disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : loading 
        ? 'cursor-wait' 
        : 'hover:scale-105 hover:shadow-2xl'
    
    const glowClasses = glow ? 'shadow-2xl' : ''
    
    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          gradientClasses[gradient || variant],
          stateClasses,
          glowClasses,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Background Glow Effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className={clsx(
            'absolute inset-0 blur-xl',
            gradient && gradient !== 'gradient' && {
              blue: 'bg-blue-400/30',
              purple: 'bg-purple-400/30',
              green: 'bg-green-400/30',
              orange: 'bg-orange-400/30',
              pink: 'bg-pink-400/30'
            }[gradient]
          )} />
        </div>
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Button Content */}
        <div className="relative flex items-center justify-center space-x-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 hover:translate-x-full group-hover:translate-x-full" />
      </button>
    )
  }
)

NeonButton.displayName = 'NeonButton'

export { NeonButton }
