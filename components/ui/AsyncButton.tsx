'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface AsyncButtonProps {
  children: React.ReactNode
  onClick?: () => void | Promise<void>
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function AsyncButton({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: AsyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!onClick || isLoading || disabled) return
    
    setIsLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error('AsyncButton error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/25",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500",
    outline: "border border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  )
}
